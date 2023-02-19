import express from 'express';
import { GqlDeploymentStatus } from 'src/generated/graphql';
import { deployToKube } from 'src/graphql/resolvers/apps/DeployAppResolver';
import DateHelper from 'src/libs/DateHelper';
import withAttachApp from './withAttachedApp';

const createBuild = withAttachApp(async ({ app, db, res }) => {
  // Increase the build version
  const nextVersion = app.currentVersion + 1;

  // Update the app version
  await db.updatePartialAppById(app.id, {
    version: nextVersion,
  });

  // Create build
  const buildId = await db.createDeployment({
    createdAt: DateHelper.getCurrentUnixTimestamp(),
    status: GqlDeploymentStatus.Pending,
    version: nextVersion.toString(),
  });

  return res.json({
    build_id: buildId,
    version: nextVersion,
    env: app.env,
  });
});

const updateBuild = withAttachApp(async ({ db, res, req }) => {
  const buildId = req.params.build_id;

  if (!buildId) return res.status(500).json({ error: { message: 'Please provide valid build id' } });

  const build = await db.getDeployment(buildId);
  if (!build) return res.status(500).json({ error: { message: 'Please provide valid build id' } });

  const isCompleted = req.body.status === GqlDeploymentStatus.Success || req.body.status === GqlDeploymentStatus.Failed;

  await db.updateDeployment(buildId, {
    ...req.body,
    ...(isCompleted ? {} : { completedAt: DateHelper.getCurrentUnixTimestamp() }),
  });

  return res.json({ success: true });
});

const deployBuild = withAttachApp(async ({ db, app, res, req }) => {
  const buildId = req.params.build_id;

  if (!buildId) return res.status(500).json({ error: { message: 'Please provide valid build id' } });

  const build = await db.getDeployment(buildId);
  if (!build) return res.status(500).json({ error: { message: 'Please provide valid build id' } });

  const currentBuildVersion = Number(build.version);

  await deployToKube({
    ...app,
    version: currentBuildVersion,
    currentVersion: currentBuildVersion,
  });

  await db.updatePartialAppById(app.id, {
    currentVersion: currentBuildVersion,
    version: currentBuildVersion,
  });

  return res.json({ success: true });
});

export default function setupApis(app: express.Application) {
  app.use(express.json());

  app.use(express.urlencoded({ extended: true }));

  app.get('/health', (_, res) => {
    return res.json({ status: 1 });
  });

  app.post('/api/app/:app_id/build', createBuild); // Get the build setting
  app.put('/api/app/:app_id/build/:build_id', updateBuild); // Update the build status
  app.post('/api/app/:app_id/deploy/:build_id', deployBuild); // Deploy the build
}
