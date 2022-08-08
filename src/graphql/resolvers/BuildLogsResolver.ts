import GraphContext from '../../types/GraphContext'
import KubepiterError from '../../types/KubepiterError'

export default async function BuildLogsResolver (
  _,
  { appId, offset, limit }: { appId: string; offset: number; limit: number },
  ctx: GraphContext
) {
  if (!ctx.user) throw new KubepiterError.NoPermission()
  return await ctx.db.getBuildLogList({ appId }, offset, limit)
}
