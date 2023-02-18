import { AuthenticationError, ForbiddenError } from 'apollo-server-core';
import { GqlUserInput } from '../../../generated/graphql';
import GraphContext from '../../../types/GraphContext';

export default async function UpdateUserResolver(
  _,
  { id, value }: { id: string; value: GqlUserInput },
  ctx: GraphContext,
) {
  if (!ctx.user) throw new AuthenticationError('You do not have permission');
  if (ctx.user.role !== 'OWNER') throw new ForbiddenError('Only owner can update other user');

  return ctx.db.updateUser(id, value);
}
