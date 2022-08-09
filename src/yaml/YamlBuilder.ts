import { KubepiterApp } from '../types/common';
import _, { merge } from 'lodash';
import { V1Deployment, V1PodSpec } from '@kubernetes/client-node';
import { Environment } from '../Environment';
import getDatabaseConnection from '../drivers/databases/DatabaseInstance';

export function buildIngressFromApp(app: KubepiterApp) {
  const ingress = {
    apiVersion: 'networking.k8s.io/v1',
    kind: 'Ingress',
    metadata: {
      name: `${app.name}-ingress`,
      namespace: Environment.DEFAULT_NAMESPACE,
      labels: {
        app: app.name,
        'managed-by-kubepiter': 'true',
      },
    },
    spec: {
      rules: (app.ingress || []).map((ingress) => ({
        host: ingress.host,
        http: {
          paths: [
            {
              path: ingress.path,
              pathType: 'Prefix',
              backend: {
                service: {
                  name: `${app.name}-service`,
                  port: {
                    number: app.port,
                  },
                },
              },
            },
          ],
        },
      })),
    },
  };

  if (app.ingressOverride) {
    return _.merge(ingress, app.ingressOverride);
  }
  return ingress;
}

export async function buildDeploymentFromApp(app: KubepiterApp): Promise<V1Deployment> {
  let nodeSelector: V1PodSpec['nodeSelector'] | undefined;
  if (app.nodeGroup) {
    const nodeGroup = await getDatabaseConnection().getNodeGroup(app.nodeGroup);
    if (nodeGroup) {
      nodeSelector = nodeGroup.selector;
    }
  }

  return {
    apiVersion: 'apps/v1',
    kind: 'Deployment',
    metadata: {
      name: `${app.name}-deployment`,
      namespace: Environment.DEFAULT_NAMESPACE,
      labels: {
        app: app.name,
        'managed-by-kubepiter': 'true',
      },
    },
    spec: {
      replicas: app.replicas || 1,
      selector: {
        matchLabels: {
          app: app.name,
        },
      },
      template: merge(
        {
          metadata: {
            labels: {
              app: app.name,
              'managed-by-kubepiter': 'true',
            },
          },
          spec: {
            ...(nodeSelector ? { nodeSelector } : {}),
            imagePullSecrets: [
              {
                name: app.imagePullSecret,
              },
            ],
            containers: [
              {
                name: app.name,
                image: `${app.image}:${app.staticVersion || app.version}`,
                ports: [
                  {
                    containerPort: app.port,
                  },
                ],
                env: app.env,
              },
            ],
          },
        },
        app.template,
      ),
    },
  };
}

export function buildServiceFromApp(app: KubepiterApp) {
  return {
    apiVersion: 'v1',
    kind: 'Service',
    metadata: {
      labels: {
        'managed-by-kubepiter': 'true',
        app: app.name,
      },
      name: `${app.name}-service`,
      namespace: Environment.DEFAULT_NAMESPACE,
    },
    spec: {
      selector: {
        app: app.name,
      },
      ports: [
        {
          protocol: 'TCP',
          port: app.port,
          targetPort: app.port,
        },
      ],
    },
  };
}
