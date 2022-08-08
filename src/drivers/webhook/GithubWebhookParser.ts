import express from 'express'
import {
  GitWebhookDetail,
  GitWebhookEvent,
  GitWebhookParserInterface
} from './GitWebhookParserInterface'

interface GithubPayloadBody {
  ref: string;
}

export default class GithubWebhookParser extends GitWebhookParserInterface {
  parse (req: express.Request): GitWebhookDetail {
    const body: GithubPayloadBody =
      req.headers['content-type'] === 'application/json'
        ? req.body
        : JSON.parse(req.body.payload)

    // Parsing branch
    const branch = body.ref.split('/').pop()

    // Parsing event
    const originalEvent = req.headers['X-Github-Event']
    let event: GitWebhookEvent
    if (originalEvent === 'push') {
      event = GitWebhookEvent.PUSH
    }

    return {
      branch,
      event
    }
  }

  detect (req: express.Request): boolean {
    return req.headers['user-agent'].indexOf('Github') >= 0
  }
}
