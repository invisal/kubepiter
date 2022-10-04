import { V1Ingress, V1PodSpec } from '@kubernetes/client-node';
import { GqlAppResource } from '../generated/graphql';
import { ImageBuildJobStatus } from '../k8s/ImageBuilderManager';

export interface KubepiterAppConfig {
  resources?: GqlAppResource | null;
  nodeGroup?: string;
  ingress: {
    host: string;
    path: string;
  }[];
  env?: { name: string; value: string }[];
  port: number;
  replicas?: number;
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

export interface KubepiterDeploymentLog {
  id: string;
  appId: string;
  ingressYaml: string;
  ingressSuccess: boolean;
  ingressResponse: string;
  serviceYaml: string;
  serviceSuccess: boolean;
  serviceResponse: string;
  deploymentYaml: string;
  deploymentSuccess: boolean;
  deploymentResponse: string;
  createdAt: number;
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

export interface KubepiterEventLog {
  title: string;
  type: string;
  description: string;
  createdAt: number;
}
