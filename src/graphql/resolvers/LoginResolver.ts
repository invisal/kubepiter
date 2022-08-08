import { ForbiddenError } from 'apollo-server-core';
import GraphContext from '../../types/GraphContext';
import bycrypt from 'bcrypt';
import crypto from 'crypto';

interface Props {
  username: string;
  password: string;
  ttl?: number;
}

export default async function LoginResolver(_, { username, password, ttl }: Props, ctx: GraphContext) {
  const user = await ctx.db.getUserByUsername(username);

  if (!user) {
    throw new ForbiddenError('User or password does not matched');
  }

  if (!bycrypt.compareSync(password, user.password)) {
    throw new ForbiddenError('User or password does not matched');
  }

  // Generate new token
  const randomToken =
    'cx' +
    crypto
      .randomBytes(32)
      .toString('base64')
      .replace(/[\s=+/]/g, '');

  await ctx.db.createUserToken(randomToken, user.id, ttl);

  return {
    token: randomToken,
  };
}
