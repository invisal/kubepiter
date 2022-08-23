import { PubSub } from 'graphql-subscriptions';

const pubsub = new PubSub();

export const PUBSUB_TRIGGER_BUILD_QUEUE = 'build_queue';

export default function getPubSub() {
  return pubsub;
}
