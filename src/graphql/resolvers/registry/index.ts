import { gql } from 'apollo-server-core';
import CreateRegistryResolver from './CreateRegistryResolver';
import RegistriesResolver from './RegistriesResolver';
import RegistryReposResolver from './RegistryReposResolver';

export const RegistrySchemas = gql`
  extend type Query {
    registries: [Registry]
    registryRepos(registryName: String!): [RegistryRepository]
    registryRepoTags(registryName: String!, repositoryName: String!): [RegistryRepositoryTag]
    registryManifest(registryName: String!, repositoryName: String!, tag: String): RegistryManifest
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

  type RegistryRepository {
    name: String
  }

  type RegistryRepositoryTag {
    name: String
  }

  type RegistryManifest {
    size: Int
    contentDiggest: String
    layers: [RegistryManifestLayer]
  }

  type RegistryManifestLayer {
    contentDiggest: String
    size: Int
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
    registryRepos: RegistryReposResolver,
  },
  Mutation: {
    createRegistry: CreateRegistryResolver,
  },
};
