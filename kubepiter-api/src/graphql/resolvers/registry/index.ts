import CreateRegistryResolver from './CreateRegistryResolver';
import DeleteRegistryResolver from './DeleteRegistryResolver';
import EnforceKeepNthPolicyResolver from './EnforceKeepNthPolicyResolver';
import RegistriesResolver from './RegistriesResolver';
import RegistryReposResolver from './RegistryReposResolver';
import RegistryRepoTagsResolver from './RegistryRepoTagsResolver';
import UpdateRegistryResolver from './UpdateRegistryResolver';

export const RegistryResolvers = {
  Query: {
    registries: RegistriesResolver,
    registryRepos: RegistryReposResolver,
    registryRepoTags: RegistryRepoTagsResolver,
  },
  Mutation: {
    createRegistry: CreateRegistryResolver,
    updateRegistry: UpdateRegistryResolver,
    deleteRegistry: DeleteRegistryResolver,
    enforceKeepNthPolicy: EnforceKeepNthPolicyResolver,
  },
};
