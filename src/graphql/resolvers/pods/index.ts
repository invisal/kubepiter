import { gql } from 'apollo-server-core';
import PodLogResolver from './PodLogResolver';
import PodResolver from './PodResolver';
import PodsResolver from './PodsResolver';

export const PodSchemas = gql`
  extend type Query {
    pods(appId: String): [Pod]
    pod(name: String!): Pod
    podLog(name: String!, tailLines: Int = 200): String
  }

  type Pod {
    name: String
    status: String
    podScheduledTime: String
    raw: JSON
  }
`;

export const PodResolvers = {
  Query: {
    pod: PodResolver,
    pods: PodsResolver,
    podLog: PodLogResolver,
  },
};
