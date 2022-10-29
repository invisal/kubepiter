import { ForbiddenError } from 'apollo-server-core';
import GraphContext from 'src/types/GraphContext';

export default async function ComponentsResolver(_, __, ctx: GraphContext) {
  if (!ctx.user) throw new ForbiddenError('You do not have permission');

  const deployments = await ctx.k8Api.listDeploymentForAllNamespaces();
  const images = deployments.body.items
    .filter((deploy) => {
      return deploy?.spec?.template?.spec?.containers && deploy.spec.template.spec.containers.length > 0;
    })
    .map((x) => x.spec.template.spec.containers[0].image);

  return [
    {
      name: 'NGINX_INGRESS',
      installed: !!images.find((image) => image.indexOf('k8s.gcr.io/ingress-nginx/controller') >= 0),
      required: true,
    },
    {
      name: 'METRIC_SERVER',
      installed: !!images.find((image) => image.indexOf('k8s.gcr.io/metrics-server/metrics-server') >= 0),
      required: true,
    },
    {
      name: 'LETENCRYPT_MANAGER',
      installed: !!images.find((image) => image.indexOf('jetstack/cert-manager-controller') >= 0),
      required: false,
    },
  ];
}
