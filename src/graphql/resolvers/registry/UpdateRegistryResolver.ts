import * as k8s from '@kubernetes/client-node';
import { ForbiddenError, ValidationError } from 'apollo-server-core';
import { Environment } from 'src/Environment';
import { GqlRegistryInput } from 'src/generated/graphql';
import { parseRegistrySecret } from 'src/libs/parseRegistrySecret';
import GraphContext from 'src/types/GraphContext';

export default async function UpdateRegistryResolver(
  _,
  { name, value }: { name: string; value: GqlRegistryInput },
  ctx: GraphContext,
) {
  if (!ctx.user) throw new ForbiddenError('You do not have permission');

  const k8secret = await ctx.k8Core.readNamespacedSecret(name, Environment.DEFAULT_NAMESPACE);
  if (!k8secret) throw new ValidationError('Registry name does not exist');

  const { username, password, endpoint } = parseRegistrySecret(k8secret.body);

  const config = {
    auths: {
      [value.endpoint || endpoint]: {
        auth: Buffer.from(`${value.username || username}:${value.password || password}`).toString('base64'),
      },
    },
  };

  const annotations: Record<string, string> = { ...(k8secret.body.metadata?.annotations || {}) };
  if (value.urlPrefix) {
    annotations['kubepiter-prefix'] = value.urlPrefix;
  }

  if (value.urlPrefix === null) {
    delete annotations['kubepiter-prefix'];
  }

  await ctx.k8Core.patchNamespacedSecret(
    name,
    Environment.DEFAULT_NAMESPACE,
    {
      apiVersion: 'v1',
      kind: 'Secret',
      metadata: {
        name: value.name,
        annotations: Object.keys(annotations).length > 0 ? annotations : undefined,
      },
      type: 'kubernetes.io/dockerconfigjson',
      data: {
        '.dockerconfigjson': Buffer.from(JSON.stringify(config)).toString('base64'),
      },
    },
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

  return true;
}
