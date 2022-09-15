import { AuthenticationError } from 'apollo-server-core';
import { Environment } from 'src/Environment';
import logger from 'src/global/logger';
import GraphContext from 'src/types/GraphContext';

export default async function DeleteAppResolver(_, { id }: { id: string }, ctx: GraphContext) {
  if (!ctx.user) throw new AuthenticationError('You do not have permission');

  const serviceName = id + '-service';
  const deploymentName = id + '-deployment';
  const ingressName = id + '-ingress';

  try {
    await ctx.k8Api.deleteNamespacedDeployment(deploymentName, Environment.DEFAULT_NAMESPACE);
  } catch (e) {
    logger.error(e.message);
  }

  try {
    await ctx.k8Network.deleteNamespacedIngress(ingressName, Environment.DEFAULT_NAMESPACE);
  } catch (e) {
    logger.error(e.message);
  }

  try {
    await ctx.k8Core.deleteNamespacedService(serviceName, Environment.DEFAULT_NAMESPACE);
  } catch (e) {
    logger.error(e.message);
  }

  await ctx.db.deleteApp(id);

  return true;
}
