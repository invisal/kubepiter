import { gql, SubscriptionHookOptions, useSubscription } from "@apollo/client";
import { GqlSubscription } from "src/generated/graphql";

const SUBSCRIPTION = gql`
  subscription buildQueueChanged {
    buildQueueChanged {
      id
      status
      appId
      version
    }
  }
`;

export default function useApiBuildQueueChange(
  options?: SubscriptionHookOptions<GqlSubscription>
) {
  return useSubscription(SUBSCRIPTION, options);
}
