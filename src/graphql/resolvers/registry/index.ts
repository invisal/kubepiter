import { gql } from 'apollo-server-core';
import CreateRegistryResolver from './CreateRegistryResolver';
import RegistriesResolver from './RegistriesResolver';

export const RegistrySchemas = gql`
  extend type Query {
    registries: [Registry]
  }

  extend type Mutation {
    createRegistry(value: RegistryInput): String
    deleteRegistry(name: String!): Boolean
  }

  type Registry {
    name: ID!
    auth: String
    managed: Boolean
  }

  input RegistryInput {
    name: ID!
    endpoint: String
    username: String
    password: String
  }
`;

export const RegistryResolvers = {
  Query: {
    registries: RegistriesResolver,
  },
  Mutation: {
    createRegistry: CreateRegistryResolver,
  },
};
