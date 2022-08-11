import { AuthenticationError, ForbiddenError } from 'apollo-server-core';
import GraphContext from '../../../types/GraphContext';

export default async function DeleteUserResolver(_, { id }: { id: string }, ctx: GraphContext) {
  if (!ctx.user) throw new AuthenticationError('You do not have permission');
  if (ctx.user.role !== 'OWNER') throw new ForbiddenError('Only owner can delete user');
  if (id === ctx.user.id) throw new ForbiddenError('You cannot delete yourself');

  return ctx.db.deleteUser(id);
}
