import * as k8s from '@kubernetes/client-node'
import { parseQuantity } from '../libs/parseQuantity'

export default class KubeMetric {
  protected config: k8s.KubeConfig
  protected api: k8s.CoreV1Api
  protected metric: k8s.Metrics

  constructor (config: k8s.KubeConfig, api: k8s.CoreV1Api) {
    this.config = config
    this.api = api
    this.metric = new k8s.Metrics(config)
  }

  async getNodes () {
    const r = await k8s.topNodes(this.api)
    const nodeMetricList = await this.metric.getNodeMetrics()

    const nodes = r.map((node) => {
      const usage = nodeMetricList.items.find(
        (nodeMetric) => node.Node.metadata.name === nodeMetric.metadata.name
      )?.usage

      // More Reading
      // https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/
      return {
        name: node.Node.metadata.name,
        memoryUsage: {
          capacity: parseQuantity(node.Node.status.capacity.memory),
          allocatable: parseQuantity(node.Node.status.allocatable.memory),
          usage: parseQuantity(usage.memory),
          limit: Number(node.Memory.LimitTotal.valueOf()),
          request: Number(node.Memory.RequestTotal.valueOf())
        },
        cpuUsage: {
          capacity: parseQuantity(node.Node.status.capacity.cpu),
          allocatable: parseQuantity(node.Node.status.allocatable.cpu),
          usage: parseQuantity(usage.cpu),
          limit: Number(node.CPU.LimitTotal.valueOf()),
          request: Number(node.CPU.RequestTotal.valueOf())
        }
      }
    })

    return nodes
  }
}
