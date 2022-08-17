import { ContainerMetric, CoreV1Api, HttpError, KubeConfig, ObjectSerializer } from '@kubernetes/client-node';
import request from 'request';

export interface SinglePodMetrics {
  kind: 'PodMetrics';
  apiVersion: 'metrics.k8s.io/v1beta1';
  metadata: {
    name: string;
    namespace: string;
    creationTimestamp: string;
    labels: { [key: string]: string };
  };
  timestamp: string;
  window: string;
  containers: ContainerMetric[];
}

export default class KubeHelper {
  async readNamespacedSecret(k8Api: CoreV1Api, namespace: string, name: string) {
    try {
      return await k8Api.readNamespacedSecret(name, namespace);
    } catch (e) {
      return null;
    }
  }

  /**
   * Get a single pod metric. This is temporary solution until the official
   * nodejs kubernetes client add this feature
   *
   * @param kc
   * @param namespace
   * @param name
   * @returns
   */
  async getPodMetric(kc: KubeConfig, namespace: string, name: string) {
    return this.metricsApiRequest<SinglePodMetrics>(
      kc,
      `/apis/metrics.k8s.io/v1beta1/namespaces/${namespace}/pods/${name}`,
    );
  }

  // Taken from
  // https://github.com/RCCSilva/javascript/blob/d25ff2d7ddd1638b22a5797b4068cb1086a32339/src/metrics.ts
  private async metricsApiRequest<T>(kc: KubeConfig, path: string): Promise<T> {
    const cluster = kc.getCurrentCluster();
    if (!cluster) {
      throw new Error('No currently active cluster');
    }

    const requestOptions: request.Options = {
      method: 'GET',
      uri: cluster.server + path,
    };

    await kc.applyToRequest(requestOptions);

    return new Promise((resolve, reject) => {
      request(requestOptions, (error, response, body) => {
        if (error) {
          reject(error);
        } else if (response.statusCode !== 200) {
          try {
            const deserializedBody = ObjectSerializer.deserialize(JSON.parse(body), 'V1Status');
            reject(new HttpError(response, deserializedBody, response.statusCode));
          } catch (e) {
            reject(new HttpError(response, body, response.statusCode));
          }
        } else {
          resolve(JSON.parse(body) as T);
        }
      });
    });
  }
}
