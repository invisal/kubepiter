import { gql } from 'apollo-server-core';
import ComponentsResolver from './ComponentsResolver';
import SetupOwnerAccountResolver from './SetupOwnerAccountResolver';
import SetupStatusResolver from './SetupStatusResolver';

export const SetupSchemas = gql`
  extend type Query {
    setupStatus: SetupStatus
    components: [Component]
  }

  extend type Mutation {
    setupOwnerAccount(username: String, password: String): Boolean
  }

  type SetupStatus {
    hasOwnerSetup: Boolean
  }

  type Component {
    name: ComponentName
    installed: Boolean
    required: Boolean
  }

  enum ComponentName {
    NGINX_INGRESS
    METRIC_SERVER
    LETENCRYPT_MANAGER
  }
`;

export const SetupResolvers = {
  Query: {
    setupStatus: SetupStatusResolver,
    components: ComponentsResolver,
  },
  Mutation: {
    setupOwnerAccount: SetupOwnerAccountResolver,
  },
};
