import { AuthenticationError } from 'apollo-server-core';
import GraphContext from '../../../types/GraphContext';

export default async function UserResolver(_, __, ctx: GraphContext) {
  if (!ctx.user) throw new AuthenticationError('You do not have permission');
  return ctx.db.getUserList();
}
