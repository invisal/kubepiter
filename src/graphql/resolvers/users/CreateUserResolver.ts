import password from 'secure-random-password';
import bycrypt from 'bcrypt';
import { AuthenticationError, ForbiddenError } from 'apollo-server-core';
import { GqlUserInput } from '../../../generated/graphql';
import GraphContext from '../../../types/GraphContext';

export default async function CreateUserResolver(_, { value }: { value: GqlUserInput }, ctx: GraphContext) {
  if (!ctx.user) throw new AuthenticationError('You do not have permission');
  if (ctx.user.role !== 'OWNER') throw new ForbiddenError('Only owner can create new user');

  const randomPassword = password.randomPassword();

  return {
    id: await ctx.db.insertUser({ ...value, password: randomPassword }),
    password: bycrypt.hashSync(randomPassword, 12),
  };
}
