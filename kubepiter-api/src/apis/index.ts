import express from 'express';
import handleDeployApp from './handleDeployApp';
import handleGenerateBuildCommand from './handleGenerateBuildCommand';
import handleGitWebhook from './handleGitWebhook';
import * as pkg from 'package.json';

export default function setupApis(app: express.Application) {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get('/health', (req, res) => {
    return res.json({ status: 1 });
  });

  app.get('/', (req, res) => {
    return res.json({
      version: pkg.version,
      name: pkg.name,
    });
  });

  app.get('/app/generate_build/:app_id/:token', handleGenerateBuildCommand);
  app.post('/app/deploy/:app_id/:token', handleDeployApp);
  app.all('/webhook/:app_id/:token', handleGitWebhook);
}
