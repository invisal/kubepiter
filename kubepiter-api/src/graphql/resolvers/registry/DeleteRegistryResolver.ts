import { ForbiddenError } from 'apollo-server-core';
import { Environment } from 'src/Environment';
import logger from 'src/global/logger';
import GraphContext from 'src/types/GraphContext';

export default async function DeleteRegistryResolver(
  _,
  { name, force }: { name: string; force: boolean },
  ctx: GraphContext,
) {
  if (!ctx.user) throw new ForbiddenError('You do not have permission');

  if (!force) {
    // If it is not a force delete, we need to make sure
    // it is safe to remove.
    const apps = await ctx.db.getAppList();
    const countAppUsed = apps.filter((app) => app.imagePullSecret === name).length;

    if (countAppUsed > 0) {
      throw new ForbiddenError('There are apps using this registry.');
    }
  }

  try {
    await ctx.k8Core.deleteNamespacedSecret(name, Environment.DEFAULT_NAMESPACE);
  } catch (e) {
    logger.error(`Attempt to delete registry ${name} and got this error: ${e.message}`);
  }

  return true;
}
