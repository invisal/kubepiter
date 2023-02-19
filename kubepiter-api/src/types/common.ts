import { V1Ingress, V1PodSpec } from '@kubernetes/client-node';
import { GqlAppResource } from '../generated/graphql';

export interface KubepiterAppConfig {
  resources?: GqlAppResource | null;
  nodeGroup?: string;

  ingress: {
    host: string;
    path: string;
  }[];
  ingressBodySize?: number;

  env?: { name: string; value: string }[];
  port: number;
  replicas?: number;

  dockerfilePath?: string;
}

export interface KubepiterApp extends KubepiterAppConfig {
  id: string;
  name: string;
  namespace?: string;
  image: string;

  version: number;
  currentVersion?: number;
  staticVersion: string;

  imagePullSecret?: string;
  folderName?: string;

  // For override the pod template
  template?: unknown;

  webhookToken?: string;
  ingressOverride?: V1Ingress;

  git?: {
    url: string;
    branch: string;
    username?: string;
    password?: string;
  };

  lastConfig: KubepiterAppConfig;
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

export interface KubepiterEventLog {
  title: string;
  type: string;
  description: string;
  createdAt: number;
}
