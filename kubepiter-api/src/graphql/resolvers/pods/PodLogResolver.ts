import { AuthenticationError } from 'apollo-server-core';
import { Environment } from '../../../Environment';
import GraphContext from '../../../types/GraphContext';

export default async function PodLogResolver(
  _,
  { name, tailLines }: { name: string; tailLines: number },
  ctx: GraphContext,
) {
  if (!ctx.user) throw new AuthenticationError('You do not have permission');

  const response = await ctx.k8Core.readNamespacedPodLog(
    name,
    Environment.DEFAULT_NAMESPACE,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    tailLines,
  );
  return response.body;
}
