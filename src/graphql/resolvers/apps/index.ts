import { gql } from 'apollo-server-core';
import UpdateAppResolver from '../UpdateAppResolver';
import AppResolver from './AppResolver';
import AppsResolver from './AppsResolver';
import CreateAppResolver from './CreateAppResolver';
import DeleteAppResolver from './DeleteAppResolver';
import DeployAppResolver from './DeployAppResolver';
import RegenerateAppWebhookResolver from './RegenerateAppWebhookResolver';
import RollbackAppResolver from './RollbackAppResolver';

export const AppSchemas = gql`
  extend type Query {
    app(id: ID!): App
    apps: [App]
  }

  extend type Mutation {
    updateApp(id: ID!, value: AppInput): Boolean
    createApp(name: String!): String
    deployApp(id: ID!, deploy: Boolean = True, build: Boolean = True): DeployResponse
    deleteApp(id: ID!): Boolean
    regenerateAppWebhook(id: ID!): String
    rollbackApp(appId: ID!, version: Int): Boolean
  }

  type App {
    id: ID
    name: String
    replicas: Int
    cluster: String
    env: [AppEnvironmentVariable]
    image: String
    ingress: [AppIngress]
    nodeGroup: String
    folderName: String

    version: Int
    currentVersion: Int
    staticVersion: String

    port: Int
    namespace: String
    lastBuildJob: BuildJob
    imagePullSecret: String
    git: AppGit

    yamlIngress: String
    yamlDeployment: String
    yamlService: String

    gitWebhook: String
    resources: AppResource
    resourceUsage: ResourceUsageDetail
    dockerfilePath: String

    hasChanged: Boolean
  }

  type ResourceUsageDetail {
    cpu: ResourceUsage
    memory: ResourceUsage
    totalPod: Int
  }

  type AppResource {
    requests: AppResourceQuota
    limits: AppResourceQuota
  }

  type AppResourceQuota {
    memory: Int
    cpu: Float
  }

  input AppResourceInput {
    requests: AppResourceQuotaInput
    limits: AppResourceQuotaInput
  }

  input AppResourceQuotaInput {
    memory: Int
    cpu: Float
  }

  type AppIngress {
    host: String
    path: String
  }

  input AppIngressInput {
    host: String!
    path: String!
  }

  type AppEnvironmentVariable {
    name: String!
    value: String!
  }

  input AppInput {
    env: [AppEnvironmentVariableInput]
    name: String
    replicas: Int
    cluster: String
    image: String
    ingress: [AppIngressInput]
    staticVersion: String
    port: Int
    namespace: String
    version: Int
    git: AppGitInput
    imagePullSecret: String
    folderName: String
    nodeGroup: String
    resources: AppResourceInput
    dockerfilePath: String
  }

  type AppGit {
    url: String
    branch: String
    hasAuth: Boolean
  }

  input AppGitInput {
    url: String
    username: String
    password: String
    branch: String
  }

  input AppEnvironmentVariableInput {
    name: String!
    value: String!
  }
`;

export const AppResolvers = {
  Query: {
    apps: AppsResolver,
    app: AppResolver,
  },
  Mutation: {
    updateApp: UpdateAppResolver,
    createApp: CreateAppResolver,
    deleteApp: DeleteAppResolver,
    deployApp: DeployAppResolver,
    regenerateAppWebhook: RegenerateAppWebhookResolver,
    rollbackApp: RollbackAppResolver,
  },
};
