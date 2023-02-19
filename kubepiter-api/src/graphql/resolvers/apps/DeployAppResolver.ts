import * as k8s from '@kubernetes/client-node';
import getDatabaseConnection from '../../../drivers/databases/DatabaseInstance';
import { getKuberneteApi, getKuberneteCore, getKuberneteNetwork } from '../../../k8s/getKubernete';
import { KubepiterApp } from '../../../types/common';
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
