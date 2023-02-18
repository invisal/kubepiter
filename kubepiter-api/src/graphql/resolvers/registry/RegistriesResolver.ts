import { parseRegistrySecret } from 'src/libs/parseRegistrySecret';
import { Environment } from '../../../Environment';
import { getKuberneteCore } from '../../../k8s/getKubernete';
import GraphContext from '../../../types/GraphContext';
import KubepiterError from '../../../types/KubepiterError';

export default async function RegistriesResolver(_, __, ctx: GraphContext) {
  if (!ctx.user) throw new KubepiterError.NoPermission();

  const coreApi = getKuberneteCore();
  const res = await coreApi.listNamespacedSecret(Environment.DEFAULT_NAMESPACE);

  const registries = res.body.items.filter((item) => item.type === 'kubernetes.io/dockerconfigjson');
  const apps = await ctx.db.getAppList();

  return registries.map((registry) => {
    const { endpoint } = parseRegistrySecret(registry);

    return {
      name: registry.metadata.name,
      auth: endpoint,
      endpoint,
      urlPrefix: (registry.metadata?.annotations || {})['kubepiter-prefix'],
      managed: Object.keys(registry.metadata.labels || {}).indexOf('managed-by-kubepiter') >= 0,
      totalAppUsed: apps.filter((app) => app.imagePullSecret === registry.metadata.name).length,
    };
  });
}
