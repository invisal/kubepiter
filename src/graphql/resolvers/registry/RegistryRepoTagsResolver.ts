import { ForbiddenError, ValidationError } from 'apollo-server-core';
import { Environment } from 'src/Environment';
import getRegistryClient from 'src/global/getRegistryClient';
import GraphContext from 'src/types/GraphContext';

export default async function RegistryRepoTagsResolver(
  _,
  { registryName, repositoryName }: { registryName: string; repositoryName: string },
  ctx: GraphContext,
) {
  if (!ctx.user) throw new ForbiddenError('You do not have permission');

  const k8secret = await ctx.k8Core.readNamespacedSecret(registryName, Environment.DEFAULT_NAMESPACE);
  if (!k8secret) throw new ValidationError('Registry name does not exist');

  const client = getRegistryClient(k8secret.body);
  const r = await client.listTags(repositoryName);

  return r.data.tags.map((tag) => ({ name: tag }));
}
