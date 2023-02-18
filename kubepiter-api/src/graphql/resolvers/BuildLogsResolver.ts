import GraphContext from '../../types/GraphContext';
import KubepiterError from '../../types/KubepiterError';

export default async function BuildLogsResolver(
  _,
  { appId, status, offset, limit }: { appId: string; status: string[]; offset: number; limit: number },
  ctx: GraphContext,
) {
  if (!ctx.user) throw new KubepiterError.NoPermission();
  return await ctx.db.getBuildLogList({ appId, status }, offset, limit);
}
