import express from 'express';
import handleDeployApp from './handleDeployApp';
import handleGenerateBuildCommand from './handleGenerateBuildCommand';
import handleGitWebhook from './handleGitWebhook';

export default function setupApis(app: express.Application) {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get('/app/generate_build/:app_id/:token', handleGenerateBuildCommand);
  app.post('/app/deploy/:app_id/:token', handleDeployApp);

  app.all('/webhook/:app_id/:token', handleGitWebhook);

  app.use((err: Error, req: express.Request, res: express.Response) => {
    return res.status(500).json({ error: { message: err.message } });
  });
}
