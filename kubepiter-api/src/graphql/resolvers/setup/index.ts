import ComponentsResolver from './ComponentsResolver';
import SetupOwnerAccountResolver from './SetupOwnerAccountResolver';
import SetupStatusResolver from './SetupStatusResolver';

export const SetupResolvers = {
  Query: {
    setupStatus: SetupStatusResolver,
    components: ComponentsResolver,
  },
  Mutation: {
    setupOwnerAccount: SetupOwnerAccountResolver,
  },
};
