import GraphContext from '../../types/GraphContext'
import KubepiterError from '../../types/KubepiterError'

export default async function NodeGroupsResolver (_, __, ctx: GraphContext) {
  if (!ctx.user) throw new KubepiterError.NoPermission()

  const nodes = await ctx.db.getNodeGroupList()
  return nodes
}
