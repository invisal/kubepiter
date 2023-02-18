import { AuthenticationError } from 'apollo-server-core';
import { Environment } from '../../../Environment';
import GraphContext from '../../../types/GraphContext';

export default async function PodResolver(_, { name }: { name: string }, ctx: GraphContext) {
  if (!ctx.user) throw new AuthenticationError('You do not have permission');

  const response = await ctx.k8Core.readNamespacedPod(name, Environment.DEFAULT_NAMESPACE);
  return {
    name: response.body.metadata.name,
    status: response.body.status.phase,
    raw: response.body,
    podScheduledTime: response.body.status.conditions.find((condition) => condition.type === 'PodScheduled')
      ?.lastTransitionTime,
  };
}
