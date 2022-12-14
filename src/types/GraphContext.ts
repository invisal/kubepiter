import { AppsV1Api, CoreV1Api, NetworkingV1Api } from '@kubernetes/client-node';
import DatabaseInterface from '../drivers/databases/DatabaseInterface';
import { ImageBuilderManager } from '../k8s/ImageBuilderManager';
import KubeMetric from '../k8s/KubeMetric';
import { KubepiterUser } from './common';

export default interface GraphContext {
  db: DatabaseInterface;
  user: KubepiterUser;
  buildManager: ImageBuilderManager;
  metricManager: KubeMetric;

  k8Api: AppsV1Api;
  k8Core: CoreV1Api;
  k8Network: NetworkingV1Api;
}
