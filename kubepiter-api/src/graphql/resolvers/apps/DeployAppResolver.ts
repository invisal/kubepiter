import * as k8s from '@kubernetes/client-node';
import getDatabaseConnection from '../../../drivers/databases/DatabaseInstance';
import DatabaseInterface from '../../../drivers/databases/DatabaseInterface';
import { getKuberneteApi, getKuberneteCore, getKuberneteNetwork } from '../../../k8s/getKubernete';
import { getBuildManager, ImageBuildJobStatus } from '../../../k8s/ImageBuilderManager';
import { KubepiterApp } from '../../../types/common';
import GraphContext from '../../../types/GraphContext';
import KubepiterError from '../../../types/KubepiterError';
import { buildDeploymentFromApp, buildServiceFromApp, buildIngressFromApp } from '../../../yaml/YamlBuilder';
import yaml from 'yaml';
import { extractAppConfigurationFromApp } from 'src/libs/appConfiguration';

export async function deployToKube(app: KubepiterApp) {
  const db = getDatabaseConnection();
  const deploymentYaml = await buildDeploymentFromApp(app);
  const serviceYaml = buildServiceFromApp(app);
  const ingressYaml = buildIngressFromApp(app);

  const k8sApp = getKuberneteApi();
  const k8sApi = getKuberneteCore();
  const k8sNetwork = getKuberneteNetwork();

  let ingressSuccess = null;
  let serviceSuccess = null;
  let deploymentSuccess = null;
  let ingressResponse = '';
  let serviceResponse = '';
  let deploymentResponse = '';

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
      deploymentSuccess = true;
    } else {
      await k8sApp.createNamespacedDeployment(deploymentYaml.metadata.namespace, deploymentYaml);
      deploymentSuccess = true;
    }
  } catch (e) {
    deploymentSuccess = false;
    deploymentResponse = e.message;
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
      serviceSuccess = true;
    } else {
      await k8sApi.createNamespacedService(serviceYaml.metadata.namespace, serviceYaml);
      serviceSuccess = true;
    }
  } catch (e) {
    serviceSuccess = false;
    serviceResponse = e.message;
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
      ingressSuccess = true;
    } else {
      await k8sNetwork.createNamespacedIngress(ingressYaml.metadata.namespace, ingressYaml);
      ingressSuccess = true;
    }
  } catch (e) {
    ingressSuccess = false;
    ingressResponse = e.message;
  }

  await db.insertDeploymentLog({
    appId: app.id,
    deploymentResponse,
    deploymentYaml: yaml.stringify(deploymentYaml, {
      version: '1.1',
    }),
    deploymentSuccess,
    ingressResponse,
    ingressSuccess,
    ingressYaml: yaml.stringify(ingressYaml),
    serviceResponse,
    serviceSuccess,
    serviceYaml: yaml.stringify(serviceYaml),
    createdAt: Math.floor(Date.now() / 1000),
  });

  await db.updatePartialAppById(app.id, {
    lastConfig: extractAppConfigurationFromApp(app),
  });

  return {};
}

export function buildPushAndDeploy(db: DatabaseInterface, app: KubepiterApp, deploy: boolean, build: boolean) {
  // Increase version by one
  const version = build ? app.version + 1 : app.currentVersion || app.version;

  // Success callback
  const onSuccess = () => {
    if (build) {
      return db.updatePartialAppById(app.id, {
        version,
        currentVersion: version,
      });
    }
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
            deployToKube({ ...app, currentVersion: version })
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
