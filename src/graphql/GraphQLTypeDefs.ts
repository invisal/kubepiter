import { mergeTypeDefs } from '@graphql-tools/merge';
import { gql } from 'apollo-server-core';
import { AppSchemas } from './resolvers/apps';
import { PodSchemas } from './resolvers/pods';
import { RegistrySchemas } from './resolvers/registry';
import { UserSchemas } from './resolvers/users';

const OtherTypeDefs = gql`
  scalar JSON

  type Query {
    version: String
    nodes: [KubeNode]

    buildLog(id: ID!): BuildJob
    buildLogs(appId: String, offset: Int = 0, limit: Int = 20): [BuildJob]

    nodeGroups: [NodeGroup]
  }

  type Mutation {
    login(username: String!, password: String!, ttl: Int): LoginResponse
  }

  type NodeGroup {
    tag: ID!
    name: String
    description: String
    selector: JSON
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

  type ResourceUsage {
    capacity: Float
    allocatable: Float
    usage: Float
    limit: Float
    request: Float
  }
`;

const GraphQLTypeDefs = mergeTypeDefs([OtherTypeDefs, AppSchemas, UserSchemas, PodSchemas, RegistrySchemas]);
export default GraphQLTypeDefs;
