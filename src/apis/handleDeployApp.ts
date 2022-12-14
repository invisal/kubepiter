import getDatabaseConnection from '../drivers/databases/DatabaseInstance';
import { buildPushAndDeploy } from '../graphql/resolvers/apps/DeployAppResolver';
import withAttachApp from './withAttachedApp';

const handleDeployApp = withAttachApp(async ({ app, db, res }) => {
  app.version = app.version + 1;
  app.currentVersion = app.version;

  await db.updatePartialAppById(app.id, {
    version: app.version,
    currentVersion: app.version,
  });

  buildPushAndDeploy(getDatabaseConnection(), app, true, false);
  return res.json({});
});

export default handleDeployApp;
