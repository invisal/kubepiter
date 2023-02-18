import { ForbiddenError } from 'apollo-server-core';
import generateWebhookToken from '../../../libs/generateWebhookToken';
import GraphContext from '../../../types/GraphContext';

export default async function RegenerateAppWebhookTokenResolver(_, { id }: { id: string }, ctx: GraphContext) {
  if (!ctx.user) throw new ForbiddenError('You do not have permission');

  const newToken = generateWebhookToken();
  await ctx.db.updatePartialAppById(id, { webhookToken: newToken });

  return newToken;
}
