import { ForbiddenError, gql } from 'apollo-server-core';
import getPubSub, { PUBSUB_TRIGGER_BUILD_QUEUE } from '../../../core/pubsub';

const pubsub = getPubSub();

export const SubscriptionResolvers = {
  Subscription: {
    buildQueueChanged: {
      subscribe: (_, __, ctx) => {
        if (!ctx.user) throw new ForbiddenError('You do not have permission');
        return pubsub.asyncIterator(PUBSUB_TRIGGER_BUILD_QUEUE);
      },
    },
  },
};

export const SubscriptionSchemas = gql`
  type Subscription {
    buildQueueChanged: [BuildJob]
  }
`;
