import { ImageBuilderOptions, ImageBuildJobStatus } from './ImageBuilderManager';
import { URL } from 'url';
import { CoreV1Api, V1PodSpec } from '@kubernetes/client-node';
import DatabaseInterface from '../drivers/databases/DatabaseInterface';
import { Environment } from '../Environment';

const POD_BUILDER_NAME = 'kubebox-kaniko-build';

export default async function buildImageAndPush(
  coreApi: CoreV1Api,
  db: DatabaseInterface,
  options: ImageBuilderOptions,
  logCallback?: (log: string) => void,
): Promise<{
  logs: string;
  status: ImageBuildJobStatus;
}> {
  let responseStatus = ImageBuildJobStatus.FAILED;
  let responseLog = '';

  try {
    // Removing the pod
    try {
      await coreApi.deleteNamespacedPod(POD_BUILDER_NAME, Environment.DEFAULT_NAMESPACE);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('Builder does not exist. No need to remove');
    }

    const setting = await db.getBuilderSetting();
    let nodeSelector: V1PodSpec['nodeSelector'] | undefined;

    if (setting.nodeGroup) {
      const nodeGroup = await db.getNodeGroup(setting.nodeGroup);
      if (nodeGroup) {
        nodeSelector = nodeGroup.selector;
      }
    }

    // Create the building pod
    const podDefinition = generateBuilderPodDefinition(options, nodeSelector);
    await coreApi.createNamespacedPod(Environment.DEFAULT_NAMESPACE, podDefinition);

    // Waiting until the pod is completed
    while (true) {
      await wait(2000);

      const pod = await coreApi.readNamespacedPod('kubebox-kaniko-build', Environment.DEFAULT_NAMESPACE);

      // Getting the log
      try {
        const podLog = await coreApi.readNamespacedPodLog('kubebox-kaniko-build', Environment.DEFAULT_NAMESPACE);
        responseLog = podLog.body;
        if (logCallback) {
          logCallback(podLog.body);
        }
      } catch {}

      const status = pod.body.status.phase;
      if (status === 'Succeeded') {
        responseStatus = ImageBuildJobStatus.SUCCESS;
        break;
      } else if (status === 'Failed') {
        responseStatus = ImageBuildJobStatus.FAILED;
        responseLog = `${pod.body.status.reason}\r\n${pod.body.status.message}`;
        break;
      }
    }
  } catch (e) {
    console.error(e);
  }

  return { status: responseStatus, logs: responseLog };
}

function wait(n: number) {
  return new Promise((resolve) => setTimeout(resolve, n));
}

function escapeShell(cmd: string) {
  return '' + cmd.replace(/(["'$`\\])/g, '\\$1') + '';
}

function generateBuilderPodDefinition(options: ImageBuilderOptions, selector?: V1PodSpec['nodeSelector']) {
  // Building git link
  const url = new URL(options.git.url);
  if (options.git.username) {
    url.username = options.git.username;
  }

  if (options.git.password) {
    url.password = options.git.password;
  }

  return {
    apiVersion: 'v1',
    kind: 'Pod',
    metadata: {
      name: POD_BUILDER_NAME,
    },
    spec: {
      ttlSecondsAfterFinished: 60,
      automountServiceAccountToken: false,
      ...(selector ? { nodeSelector: selector } : {}),
      containers: [
        {
          name: 'kaniko',
          image: 'gcr.io/kaniko-project/executor:debug',
          env: options.args,
          args: [
            `--context=${url.href}`,
            `--destination=${options.image}:${options.version}`,
            '--verbosity=info',
            ...options.args.map((e) => `--build-arg=${e.name}=${escapeShell(e.value)}`),
          ],
          volumeMounts: [{ name: 'kaniko-secret', mountPath: '/kaniko/.docker' }],
        },
      ],
      restartPolicy: 'Never',
      volumes: [
        {
          name: 'kaniko-secret',
          secret: {
            secretName: options.imagePullSecret,
            items: [
              {
                key: '.dockerconfigjson',
                path: 'config.json',
              },
            ],
          },
        },
      ],
    },
  };
}
