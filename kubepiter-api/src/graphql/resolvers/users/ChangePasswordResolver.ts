import { AuthenticationError, UserInputError } from 'apollo-server-core';
import bcrypt from 'bcrypt';
import GraphContext from '../../../types/GraphContext';

export default async function ChangePasswordResolver(
  _,
  { oldPassword, newPassword }: { oldPassword: string; newPassword: string },
  ctx: GraphContext,
) {
  if (!ctx.user) throw new AuthenticationError('You do not have permission');

  // Validate the password
  if (newPassword.length < 6) {
    throw new UserInputError('Password must be at least 6 characters long');
  }

  // Verifiy if the old password is correct
  if (!bcrypt.compareSync(oldPassword, ctx.user.password)) {
    throw new UserInputError('Provided current password is incorrect');
  }

  return ctx.db.updateUser(ctx.user.id, {
    password: bcrypt.hashSync(newPassword, 10),
  });
}
