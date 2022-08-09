import express from 'express';
import getDatabaseConnection from '../drivers/databases/DatabaseInstance';
import GithubWebhookParser from '../drivers/webhook/GithubWebhookParser';
import { GitWebhookEvent } from '../drivers/webhook/GitWebhookParserInterface';
import { buildPushAndDeploy } from '../graphql/resolvers/DeployAppResolver';

export default async function handleGitWebhook(req: express.Request, res: express.Response) {
  const token = req.params.token;
  const appId = req.params.app_id;
  const db = getDatabaseConnection();

  const app = await db.getAppById(appId);

  if (!app) {
    return res.status(500).json({
      error: 'App does not exist',
    });
  }

  if (token !== app.webhookToken) {
    return res.status(500).json({
      error: 'Invalid token',
    });
  }

  const parsers = [new GithubWebhookParser()];

  for (const parser of parsers) {
    if (parser.detect(req)) {
      const event = parser.parse(req);

      if (event.event !== GitWebhookEvent.PUSH) return res.json({});
      if (event.branch !== app.git.branch) return res.json({});

      app.version = app.version + 1;
      await db.updatePartialAppById(appId, {
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
}
