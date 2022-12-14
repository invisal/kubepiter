import createAppResourceUsageLoader from 'src/graphql/dataloader/AppResourceUsageLoader';
import { Environment } from '../../../Environment';
import GraphContext from '../../../types/GraphContext';
import KubepiterError from '../../../types/KubepiterError';

export default async function AppsResolver(_, __, ctx: GraphContext) {
  if (!ctx.user) throw new KubepiterError.NoPermission();
  const apps = await ctx.db.getAppList();
  const loader = createAppResourceUsageLoader(ctx);

  return apps.map((app) => ({
    ...app,
    gitWebhook: `${Environment.BASE_URL}/webhook/${app.id}/${app.webhookToken}`,
    currentVersion: app.currentVersion || app.version,
    resourceUsage: () => loader.load(app.id),
    lastBuildJob: () => {
      const job = ctx.buildManager.getLastJobFromAppId(app.name);
      if (!job) return null;

      return {
        ...job,
        appId: job.options.appId,
      };
    },
  }));
}
