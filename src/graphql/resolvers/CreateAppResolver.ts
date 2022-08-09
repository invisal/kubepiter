import { GqlAppInput } from '../../generated/graphql';
import { KubepiterApp } from '../../types/common';
import GraphContext from '../../types/GraphContext';
import KubepiterError from '../../types/KubepiterError';

export default async function CreateAppResolver(
  _,
  { id, value }: { id: string; value: GqlAppInput },
  ctx: GraphContext,
) {
  if (!ctx.user) throw new KubepiterError.NoPermission();

  // Create app
  await ctx.db.createApp(id, {
    name: id,
    id,
    replicas: 1,
    version: 1,
    port: 80,
    ...value,
  } as KubepiterApp);

  return id;
}
