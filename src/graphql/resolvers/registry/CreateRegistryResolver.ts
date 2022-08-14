import { UserInputError } from 'apollo-server-core';
import { Environment } from '../../../Environment';
import { GqlRegistryInput } from '../../../generated/graphql';
import KubeHelper from '../../../libs/KubeHelper';
import GraphContext from '../../../types/GraphContext';
import KubepiterError from '../../../types/KubepiterError';

export default async function CreateRegistryResolver(_, { value }: { value: GqlRegistryInput }, ctx: GraphContext) {
  if (!ctx.user) throw new KubepiterError.NoPermission();

  // Validation
  if (value.name.length < 3) {
    throw new UserInputError('Name is too short');
  }

  // Check if the secret exists
  const secret = await new KubeHelper().readNamespacedSecret(ctx.k8Core, Environment.DEFAULT_NAMESPACE, value.name);
  if (secret) {
    throw new UserInputError('Name is already taken');
  }

  const config = {
    auths: {
      [value.endpoint]: {
        auth: Buffer.from(`${value.username}:${value.password}`).toString('base64'),
      },
    },
  };

  await ctx.k8Core.createNamespacedSecret(Environment.DEFAULT_NAMESPACE, {
    apiVersion: 'v1',
    kind: 'Secret',
    metadata: {
      name: value.name,
    },
    type: 'kubernetes.io/dockerconfigjson',
    data: {
      '.dockerconfigjson': Buffer.from(JSON.stringify(config)).toString('base64'),
    },
  });
}
