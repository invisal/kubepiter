import DatabaseInterface from '../drivers/databases/DatabaseInterface';
import { ImageBuilderManager } from '../k8s/ImageBuilderManager';
import KubeMetric from '../k8s/KubeMetric';
import { KubepiterUser } from './common';

export default interface GraphContext {
  db: DatabaseInterface;
  user: KubepiterUser;
  buildManager: ImageBuilderManager;
  metricManager: KubeMetric;
}
