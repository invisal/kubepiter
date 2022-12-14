import { V1Secret } from '@kubernetes/client-node';
import getDatabaseConnection from 'src/drivers/databases/DatabaseInstance';
import { Environment } from 'src/Environment';
import getRegistryClient from 'src/global/getRegistryClient';
import logger from 'src/global/logger';
import { getKuberneteCore } from 'src/k8s/getKubernete';

let IS_KEEP_NTH_IMAGE_RUNNING = false;

async function enforceKeepNthImagePolicyPerRegistry(registry: V1Secret, nth: number): Promise<number> {
  const client = getRegistryClient(registry);
  let deletingCount = 0;

  if (IS_KEEP_NTH_IMAGE_RUNNING) {
    logger.info('Keep nth image policy job is already running.');
    return;
  }
  IS_KEEP_NTH_IMAGE_RUNNING = true;

  try {
    const repos = await client.listRepositories();

    for (const repo of repos.data.repositories) {
      // Get the tags list
      const tags = (await client.listTags(repo)).data.tags;
      if (tags.length <= nth) continue;

      // Check if tags are all number
      const isAllNumberTags = !tags.some((tag) => !isFinite(Number(tag)));
      if (!isAllNumberTags) {
        logger.info(`Cannot enforce the rule on ${repo} because the tags does not in numberic format`);
        break;
      }

      // Sorting the tags
      const sortedTags = tags.map((tag) => Number(tag)).sort((b, c) => b - c);
      const deletingTags = sortedTags.slice(0, sortedTags.length - nth);
      logger.info(`We will delete ${deletingTags} from ${repo}`);

      for (const deletingTag of deletingTags) {
        const manifest = await client.manifests(
          repo,
          deletingTag.toString(),
          'application/vnd.docker.distribution.manifest.v2+json',
        );

        const digest = manifest.headers.get('docker-content-digest');
        if (!digest) continue;

        logger.info(`Deleting ${repo}:${deletingTag} with content digest: ${digest}`);

        await client.deleteManifest(repo, digest);
        deletingCount++;
      }
    }

    IS_KEEP_NTH_IMAGE_RUNNING = false;
    return deletingCount;
  } catch (e) {
    logger.error(e.message);
    IS_KEEP_NTH_IMAGE_RUNNING = false;
    return deletingCount;
  }
}

export default async function enforceKeepNthImagePolicy() {
  const kube = getKuberneteCore();
  const secrets = await kube.listNamespacedSecret(Environment.DEFAULT_NAMESPACE);
  const registries = secrets.body.items.filter((item) => item.type === 'kubernetes.io/dockerconfigjson');

  logger.info('Running enforceKeepNthImagePolicy');

  try {
    const db = getDatabaseConnection();
    await db.insertEventLog({
      createdAt: Math.floor(Date.now() / 1000),
      title: 'Enforce keep nth image per repository policy',
      description: 'Enforce keep nth image per repository policy',
      type: 'ENFORCE_KEEP_NTH_IMAGE_POLICY',
    });

    for (const reg of registries) {
      if (reg.metadata.annotations && reg.metadata.annotations['kubepiter-keep-nth']) {
        logger.info(`Enforce the nth policy on registry ${reg.metadata.name}`);
        await enforceKeepNthImagePolicyPerRegistry(reg, Number(reg.metadata.annotations['kubepiter-keep-nth']));
      }
    }
  } catch (e) {
    logger.error(e.message);
  }
}
