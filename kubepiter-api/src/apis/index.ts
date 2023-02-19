import express from 'express';
import withAttachApp from './withAttachedApp';

function createBuild() {}

function updateBuild() {}

function deployBuild() {}

export default function setupApis(app: express.Application) {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get('/health', (_, res) => {
    return res.json({ status: 1 });
  });

  app.post('/api/app/:app_id/build', withAttachApp(createBuild)); // Get the build setting
  app.put('/api/app/:app_id/build', withAttachApp(updateBuild)); // Update the build status
  app.post('/api/app/:app_id/deploy/:build_id', withAttachApp(deployBuild)); // Deploy the build
}
