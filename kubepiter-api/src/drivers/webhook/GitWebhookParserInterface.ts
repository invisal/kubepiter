import express from 'express';

export enum GitWebhookEvent {
  PUSH = 'PUSH',
}

export interface GitWebhookDetail {
  branch: string;
  event: GitWebhookEvent;
}

export abstract class GitWebhookParserInterface {
  abstract parse(req: express.Request): GitWebhookDetail;
  abstract detect(req: express.Request): boolean;
}
