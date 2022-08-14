import express from 'express';
import getDatabaseConnection from '../drivers/databases/DatabaseInstance';
import { buildPushAndDeploy } from '../graphql/resolvers/apps/DeployAppResolver';

export default async function handleDeployApi(
  req: express.Request<{ token: string; app_id: string }>,
  res: express.Response,
) {
  const token = req.params.token;
  const appId = req.params.app_id;
  const db = getDatabaseConnection();

  const app = await db.getAppById(appId);
  if (token !== app.webhookToken) {
    return res.status(500).json({
      error: 'Invalid token',
    });
  }

  app.version = app.version + 1;

  await db.updatePartialAppById(appId, {
    version: app.version,
    currentVersion: app.version,
  });

  buildPushAndDeploy(getDatabaseConnection(), app, true, true);

  return res.json({});
}
