import express from 'express';
import { KubepiterApp } from '../types/common';
import getDatabaseConnection from '../drivers/databases/DatabaseInstance';
import DatabaseInterface from '../drivers/databases/DatabaseInterface';

export default function withAttachApp(
  handler: (props: { app: KubepiterApp; req: express.Request; res: express.Response; db: DatabaseInterface }) => void,
) {
  return async function (req: express.Request, res: express.Response) {
    const token = req.headers.authorization.split(' ')[1];
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

    return handler({ app, req, res, db });
  };
}
