import { V1Ingress, V1PodSpec } from '@kubernetes/client-node';
import { GqlAppResource } from '../generated/graphql';
import { ImageBuildJobStatus } from '../k8s/ImageBuilderManager';

export interface KubepiterApp {
  id: string;
  name: string;
  namespace?: string;
  image: string;

  version: number;
  currentVersion?: number;
  staticVersion: string;

  port: number;
  replicas?: number;
  imagePullSecret?: string;
  ingress: {
    host: string;
    path: string;
  }[];
  env?: { name: string; value: string }[];

  nodeGroup?: string;
  folderName?: string;

  // For override the pod template
  template?: unknown;

  webhookToken?: string;
  ingressOverride?: V1Ingress;

  resources?: GqlAppResource | null;

  git?: {
    url: string;
    branch: string;
    username?: string;
    password?: string;
  };
}

export interface KubepiterUser {
  id: string;
  username: string;
  password: string;
  role?: string;
}

export interface KubepiterUserToken {
  id: string;
  token: string;
  userId: string;
}

export interface KubepiterNodeGroup {
  tag: string;
  name: string;
  description: string;
  selector: V1PodSpec['nodeSelector'];
}

export interface KubepiterBuilderSetting {
  nodeGroup?: string;
}

export interface KubepiterBuildJobLog {
  id: string;
  appId: string;
  version: string;
  createdAt: number;
  startAt: number | null;
  endAt: number | null;
  status: ImageBuildJobStatus;
  logs: string;
}
