import GraphContext from '../../types/GraphContext'
import KubepiterError from '../../types/KubepiterError'

export default async function BuildLogResolver (
  _,
  { id }: { id: string },
  ctx: GraphContext
) {
  if (!ctx.user) throw new KubepiterError.NoPermission()

  // Check if there is log in the queue
  const jobList = ctx.buildManager.getQueue()
  const foundJob = jobList.find((job) => job.id === id)

  const log = await ctx.db.getBuildLog(id)

  // Prioritize the log from queue instead of from database
  return {
    ...log,
    logs: foundJob?.logs || log.logs
  }
}
