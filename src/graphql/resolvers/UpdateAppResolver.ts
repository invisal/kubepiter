import { GqlAppInput } from '../../generated/graphql';
import { KubepiterApp } from '../../types/common';
import GraphContext from '../../types/GraphContext';
import KubepiterError from '../../types/KubepiterError';

export default async function UpdateAppResolver(
  _,
  { id, value }: { id: string; value: GqlAppInput },
  ctx: GraphContext,
) {
  if (!ctx.user) throw new KubepiterError.NoPermission();

  const app = await ctx.db.getAppById(id);

  await ctx.db.updatePartialAppById(id, {
    ...value,
    git: value.git ? { ...app.git, ...value.git } : app.git,
  } as KubepiterApp);

  return true;
}
