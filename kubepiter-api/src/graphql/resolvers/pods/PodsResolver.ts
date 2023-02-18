import { AuthenticationError } from 'apollo-server-core';
import { Environment } from '../../../Environment';
import GraphContext from '../../../types/GraphContext';

export default async function PodsResolver(_, { appId }: { appId: string }, ctx: GraphContext) {
  if (!ctx.user) throw new AuthenticationError('You do not have permission');

  const response = await ctx.k8Core.listNamespacedPod(
    Environment.DEFAULT_NAMESPACE,
    undefined,
    undefined,
    undefined,
    undefined,
    `app=${appId}`,
  );

  return response.body.items.map((pod) => ({
    name: pod.metadata.name,
    status: pod.status.phase,
    raw: pod,
    podScheduledTime: pod.status.conditions.find((condition) => condition.type === 'PodScheduled')?.lastTransitionTime,
  }));
}
