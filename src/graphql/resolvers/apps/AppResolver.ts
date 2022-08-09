import { Environment } from '../../../Environment';
import GraphContext from '../../../types/GraphContext';
import KubepiterError from '../../../types/KubepiterError';

export default async function AppResolver(_, { id }: { id: string }, ctx: GraphContext) {
  if (!ctx.user) throw new KubepiterError.NoPermission();
  const app = await ctx.db.getAppById(id);

  if (app) {
    return {
      ...app,
      id: app.name,
      gitWebhook: `${Environment.BASE_URL}/webhook/${app.id}/${app.webhookToken}`,
      git: app.git
        ? {
            ...app.git,
            hasAuth: !!app.git.username,
          }
        : undefined,
      lastBuildJob: () => {
        const job = ctx.buildManager.getLastJobFromAppId(app.name);
        if (!job) return null;

        return {
          ...job,
          appId: job.options.appId,
        };
      },
    };
  }
}
