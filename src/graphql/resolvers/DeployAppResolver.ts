import { KubepiterApp } from '../../types/common';
import GraphContext from '../../types/GraphContext';
import * as k8s from '@kubernetes/client-node';
import { buildDeploymentFromApp, buildIngressFromApp, buildServiceFromApp } from '../../yaml/YamlBuilder';
import { getBuildManager, ImageBuildJobStatus } from '../../k8s/ImageBuilderManager';
import { getKuberneteApi, getKuberneteCore, getKuberneteNetwork } from '../../k8s/getKubernete';
import KubepiterError from '../../types/KubepiterError';
import DatabaseInterface from '../../drivers/databases/DatabaseInterface';

async function deployToKube(app: KubepiterApp) {
  let errorMessage = '';

  const deploymentYaml = await buildDeploymentFromApp(app);
  const serviceYaml = buildServiceFromApp(app);
  const ingressYaml = buildIngressFromApp(app);

  const k8sApp = getKuberneteApi();
  const k8sApi = getKuberneteCore();
  const k8sNetwork = getKuberneteNetwork();

  try {
    if (app.version > 1) {
      await k8sApp.patchNamespacedDeployment(
        deploymentYaml.metadata.name,
        deploymentYaml.metadata.namespace,
        deploymentYaml,
        undefined,
        undefined,
        'application/apply-patch',
        true,
        {
          headers: {
            'Content-type': k8s.PatchUtils.PATCH_FORMAT_APPLY_YAML,
          },
        },
      );
    } else {
      await k8sApp.createNamespacedDeployment(deploymentYaml.metadata.namespace, deploymentYaml);
    }
  } catch (e) {
    console.error(e);
    errorMessage += e.message;
  }

  try {
    if (app.version > 1) {
      await k8sApi.patchNamespacedService(
        serviceYaml.metadata.name,
        serviceYaml.metadata.namespace,
        serviceYaml,
        undefined,
        undefined,
        'application/apply-patch',
        true,
        {
          headers: {
            'Content-type': k8s.PatchUtils.PATCH_FORMAT_APPLY_YAML,
          },
        },
      );
    } else {
      await k8sApi.createNamespacedService(serviceYaml.metadata.namespace, serviceYaml);
    }
  } catch (e) {
    console.error(e);
    errorMessage += e.message;
  }

  try {
    if (app.version > 1) {
      await k8sNetwork.patchNamespacedIngress(
        ingressYaml.metadata.name,
        ingressYaml.metadata.namespace,
        ingressYaml,
        undefined,
        undefined,
        'application/apply-patch',
        true,
        {
          headers: {
            'Content-type': k8s.PatchUtils.PATCH_FORMAT_APPLY_YAML,
          },
        },
      );
    } else {
      await k8sNetwork.createNamespacedIngress(ingressYaml.metadata.namespace, ingressYaml);
    }
  } catch (e) {
    console.error(e);
    errorMessage += e.message;
  }

  return {
    message: errorMessage,
  };
}

export function buildPushAndDeploy(db: DatabaseInterface, app: KubepiterApp, deploy: boolean, build: boolean) {
  // Increase version by one
  const version = app.version + 1;

  // Success callback
  const onSuccess = () => {
    return db.updatePartialAppById(app.id, {
      version,
    });
  };

  if (build) {
    getBuildManager().create(
      {
        appId: app.id,
        args: app.env || [],
        git: app.git,
        image: app.image,
        version: version.toString(),
        imagePullSecret: app.imagePullSecret,
      },
      (job) => {
        if (deploy) {
          if (job.status === ImageBuildJobStatus.SUCCESS) {
            deployToKube({ ...app, version })
              .then(onSuccess)
              .then();
          }
        }
      },
    );
  } else {
    deployToKube({ ...app, version })
      .then(onSuccess)
      .then();
  }
}

export default async function DeployAppResolver(
  _,
  { id, deploy, build }: { id: string; deploy: boolean; build: boolean },
  ctx: GraphContext,
) {
  if (!ctx.user) throw new KubepiterError.NoPermission();

  const app = await ctx.db.getAppById(id);
  buildPushAndDeploy(ctx.db, app, deploy, build);

  return {};
}
