import express from 'express';
import { GitWebhookDetail, GitWebhookEvent, GitWebhookParserInterface } from './GitWebhookParserInterface';

interface GithubPayloadBody {
  ref: string;
}

export default class GithubWebhookParser extends GitWebhookParserInterface {
  parse(req: express.Request): GitWebhookDetail {
    const body: GithubPayloadBody =
      req.headers['content-type'] === 'application/json' ? req.body : JSON.parse(req.body.payload);

    // Parsing branch
    let branch = '';

    // Parsing event
    const originalEvent = req.headers['x-github-event'] as string;
    let event: GitWebhookEvent;
    if (originalEvent.toLowerCase() === 'push') {
      event = GitWebhookEvent.PUSH;
      branch = body.ref.split('/').pop();
    }

    return {
      branch,
      event,
    };
  }

  detect(req: express.Request): boolean {
    return req.headers['user-agent'].toLowerCase().indexOf('github') >= 0;
  }
}
