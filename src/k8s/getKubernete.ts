import * as k8s from '@kubernetes/client-node'

const kc = new k8s.KubeConfig()

if (process.env.KUBECONFIG) {
  const config = JSON.parse(process.env.KUBECONFIG)
  kc.loadFromClusterAndUser(config.cluster, config.user)
} else {
  kc.loadFromCluster()
}

const apiClient = kc.makeApiClient(k8s.AppsV1Api)
const coreClient = kc.makeApiClient(k8s.CoreV1Api)
const networkClient = kc.makeApiClient(k8s.NetworkingV1Api)

export function getKuberneterConfig () {
  return kc
}

export function getKuberneteApi () {
  return apiClient
}

export function getKuberneteCore () {
  return coreClient
}

export function getKuberneteNetwork () {
  return networkClient
}
