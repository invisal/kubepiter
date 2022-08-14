import { CoreV1Api } from '@kubernetes/client-node';

export default class KubeHelper {
  async readNamespacedSecret(k8Api: CoreV1Api, namespace: string, name: string) {
    try {
      return await k8Api.readNamespacedSecret(name, namespace);
    } catch (e) {
      return null;
    }
  }
}
