import { AuthenticationError, UserInputError } from 'apollo-server-core';
import generateNameAlias from '../../../libs/generateNameAlias';
import generateWebhookToken from '../../../libs/generateWebhookToken';
import { KubepiterApp } from '../../../types/common';
import GraphContext from '../../../types/GraphContext';

export default async function CreateAppResolver(_, { name }: { name: string }, ctx: GraphContext) {
  if (!ctx.user) throw new AuthenticationError('You do not have permission');

  let retry = 0;
  let appId: string;
  let existed = false;

  if (name.length < 1) {
    throw new UserInputError('Name cannot be empty');
  }

  do {
    appId = generateNameAlias(name, retry);
    const appFromName = await ctx.db.getAppById(appId);
    existed = !!appFromName;
    retry += 1;
  } while (existed);

  // Create app
  await ctx.db.createApp(appId, {
    name,
    id: appId,
    webhookToken: generateWebhookToken(),
    env: [],
    ingress: [],
    replicas: 1,
    version: 1,
    port: 80,
  } as KubepiterApp);

  return appId;
}
