import getDatabaseConnection from '../drivers/databases/DatabaseInstance';
import GithubWebhookParser from '../drivers/webhook/GithubWebhookParser';
import { GitWebhookEvent } from '../drivers/webhook/GitWebhookParserInterface';
import { buildPushAndDeploy } from '../graphql/resolvers/apps/DeployAppResolver';
import withAttachApp from './withAttachedApp';

const handleGitWebhook = withAttachApp(async ({ app, req, res, db }) => {
  const parsers = [new GithubWebhookParser()];

  for (const parser of parsers) {
    if (parser.detect(req)) {
      const event = parser.parse(req);

      if (event.event !== GitWebhookEvent.PUSH) return res.json({});
      if (event.branch !== app.git.branch) return res.json({});

      app.version = app.version + 1;
      await db.updatePartialAppById(app.id, {
        version: app.version,
      });

      buildPushAndDeploy(getDatabaseConnection(), app, true, true);

      return res.json({
        success: true,
      });
    }
  }

  return res.status(500).json({
    error: 'Cannot parse this webhook format',
  });
});

export default handleGitWebhook;
