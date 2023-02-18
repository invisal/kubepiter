import { getKuberneteCore } from '../../k8s/getKubernete'
import GraphContext from '../../types/GraphContext'
import KubepiterError from '../../types/KubepiterError'

export default async function NodesResolver (_, __, ctx: GraphContext) {
  if (!ctx.user) throw new KubepiterError.NoPermission()

  const api = getKuberneteCore()
  const nodes = await api.listNode()
  const metricList = await ctx.metricManager.getNodes()

  return nodes.body.items.map((node) => {
    return {
      name: node.metadata.name,
      labels: node.metadata.labels,
      ...metricList.find((metric) => metric.name === node.metadata.name)
    }
  })
}
