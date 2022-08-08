import express from 'express'
import handleDeployApi from './deploy'
import handleGitWebhook from './handleGitWebhook'

export default function setupApis (app: express.Application) {
  const asyncHandler =
    (fn: express.RequestHandler) =>
      (req: express.Request, res: express.Response, next: express.NextFunction) =>
        Promise.resolve(fn(req, res, next)).catch(next)

  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  app.all('/app/deploy/:app_id/:token', asyncHandler(handleDeployApi))
  app.all('/webhook/:app_id/:token', handleGitWebhook)

  app.use((err: Error, req: express.Request, res: express.Response) => {
    return res.status(500).json({ error: { message: err.message } })
  })
}
