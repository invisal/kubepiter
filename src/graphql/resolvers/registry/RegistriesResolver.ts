import { Environment } from '../../../Environment';
import { getKuberneteCore } from '../../../k8s/getKubernete';
import GraphContext from '../../../types/GraphContext';
import KubepiterError from '../../../types/KubepiterError';

export default async function RegistriesResolver(_, __, ctx: GraphContext) {
  if (!ctx.user) throw new KubepiterError.NoPermission();

  const coreApi = getKuberneteCore();
  const res = await coreApi.listNamespacedSecret(Environment.DEFAULT_NAMESPACE);

  const registries = res.body.items.filter((item) => item.type === 'kubernetes.io/dockerconfigjson');

  return registries.map((registry) => {
    const parseData = JSON.parse(Buffer.from(registry.data['.dockerconfigjson'], 'base64').toString('ascii'));

    return {
      name: registry.metadata.name,
      auth: Object.keys(parseData.auths)[0],
      managed: Object.keys(registry.metadata.labels || {}).indexOf('managed-by-kubepiter') >= 0,
    };
  });
}
