import { ForbiddenError } from 'apollo-server-core';
import GraphContext from '../../../types/GraphContext';

export default async function UserResolver(_, { id }: { id: string }, ctx: GraphContext) {
  if (!ctx.user) throw new ForbiddenError('You do not have permission');
  return ctx.db.getUserById(id);
}
