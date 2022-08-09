import { gql } from 'apollo-server-core';

const GraphQLTypeDefs = gql`
  scalar JSON

  type Query {
    version: String
    me: User
    app(id: ID!): App
    apps: [App]
    nodes: [KubeNode]

    registries: [Registry]

    buildLog(id: ID!): BuildJob
    buildLogs(appId: String, offset: Int = 0, limit: Int = 20): [BuildJob]

    nodeGroups: [NodeGroup]
  }

  type Mutation {
    login(username: String!, password: String!, ttl: Int): LoginResponse
    updateApp(id: ID!, value: AppInput): Boolean
    createApp(id: ID!, value: AppInput): String
    deployApp(id: ID!, deploy: Boolean = True, build: Boolean = True): DeployResponse
    regenerateAppWebhook(id: ID!): String
  }

  type NodeGroup {
    tag: ID!
    name: String
    description: String
    selector: JSON
  }

  type Registry {
    name: ID!
    auth: String
    managed: Boolean
  }

  type KubeNode {
    name: String
    memoryUsage: ResourceUsage
    cpuUsage: ResourceUsage
    labels: JSON
  }

  type DeployResponse {
    message: String
    yaml: String
  }

  type LoginResponse {
    token: String
  }

  type User {
    id: ID
    username: String
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
  }

  type BuildJob {
    id: ID
    status: String
    logs: String

    createdAt: Int
    startAt: Int
    endAt: Int

    appId: String
    version: String
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

  type ResourceUsage {
    capacity: Float
    allocatable: Float
    usage: Float
    limit: Float
    request: Float
  }
`;

export default GraphQLTypeDefs;
