import { gql } from 'apollo-server-core';
import SetupOwnerAccountResolver from './SetupOwnerAccountResolver';
import SetupStatusResolver from './SetupStatusResolver';

export const SetupSchemas = gql`
  extend type Query {
    setupStatus: SetupStatus
  }

  extend type Mutation {
    setupOwnerAccount(username: String, password: String): Boolean
  }

  type SetupStatus {
    hasOwnerSetup: Boolean
  }
`;

export const SetupResolvers = {
  Query: {
    setupStatus: SetupStatusResolver,
  },
  Mutation: {
    setupOwnerAccount: SetupOwnerAccountResolver,
  },
};
