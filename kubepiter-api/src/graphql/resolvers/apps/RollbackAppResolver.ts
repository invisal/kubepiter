import { ForbiddenError } from 'apollo-server-core';
import GraphContext from '../../../types/GraphContext';
import KubepiterError from '../../../types/KubepiterError';
import { deployToKube } from './DeployAppResolver';

export default async function RollbackAppResolver(
  _,
  { appId, version }: { appId: string; version: number },
  ctx: GraphContext,
) {
  if (!ctx.user) throw new KubepiterError.NoPermission();

  const app = await ctx.db.getAppById(appId);
  if (!app) throw new ForbiddenError('App does not exist');

  await ctx.db.updatePartialAppById(appId, {
    currentVersion: version,
  });

  deployToKube({ ...app, currentVersion: version })
    .then()
    .catch();

  return true;
}
