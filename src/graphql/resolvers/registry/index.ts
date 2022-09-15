import { gql } from 'apollo-server-core';
import CreateRegistryResolver from './CreateRegistryResolver';
import DeleteRegistryResolver from './DeleteRegistryResolver';
import EnforceKeepNthPolicyResolver from './EnforceKeepNthPolicyResolver';
import RegistriesResolver from './RegistriesResolver';
import RegistryReposResolver from './RegistryReposResolver';
import UpdateRegistryResolver from './UpdateRegistryResolver';

export const RegistrySchemas = gql`
  extend type Query {
    registries: [Registry]
    registryRepos(registryName: String!): [RegistryRepository]
    registryRepoTags(registryName: String!, repositoryName: String!): [RegistryRepositoryTag]
    registryManifest(registryName: String!, repositoryName: String!, tag: String): RegistryManifest
  }

  extend type Mutation {
    createRegistry(value: RegistryInput): String
    updateRegistry(name: String!, value: RegistryInput): Boolean
    deleteRegistry(name: String!, force: Boolean): Boolean

    enforceKeepNthPolicy: Boolean
  }

  type Registry {
    name: ID!
    auth: String
    endpoint: String
    urlPrefix: String
    managed: Boolean
    totalAppUsed: Int
    policyKeepNthImage: Int
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
    name: ID
    endpoint: String
    username: String
    password: String
    urlPrefix: String
    policyKeepNthImage: Int
  }
`;

export const RegistryResolvers = {
  Query: {
    registries: RegistriesResolver,
    registryRepos: RegistryReposResolver,
  },
  Mutation: {
    createRegistry: CreateRegistryResolver,
    updateRegistry: UpdateRegistryResolver,
    deleteRegistry: DeleteRegistryResolver,
    enforceKeepNthPolicy: EnforceKeepNthPolicyResolver,
  },
};
