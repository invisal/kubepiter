import { UserInputError } from 'apollo-server-core';
import GraphContext from 'src/types/GraphContext';
import bcrypt from 'bcrypt';

export default async function SetupOwnerAccountResolver(
  _,
  { username, password }: { username: string; password: string },
  ctx: GraphContext,
) {
  const owner = await ctx.db.getOwner();
  if (owner) return false;

  // Validate the password
  if (password.length < 6) {
    throw new UserInputError('Password must be at least 6 characters long');
  }

  await ctx.db.insertUser({ username, password: bcrypt.hashSync(password, 12), role: 'OWNER' });
  return true;
}
