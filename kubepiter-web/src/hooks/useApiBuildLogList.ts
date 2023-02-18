import { gql, useQuery } from "@apollo/client";
import { useEffect } from "react";
import { GqlQuery } from "../generated/graphql";

const QUERY_BUILD_LOGS_LIST = gql`
  query buildLogs(
    $appId: String
    $status: [String]
    $offset: Int
    $limit: Int
  ) {
    buildLogs(appId: $appId, status: $status, offset: $offset, limit: $limit) {
      id
      status
      createdAt
      startAt
      endAt
      appId
      version
    }
  }
`;

export default function useApiBuildLogList(
  variables: {
    offset?: number;
    limit?: number;
    appId?: string;
    status?: string[];
  },
  pollInterval?: number
) {
  const r = useQuery<GqlQuery>(QUERY_BUILD_LOGS_LIST, {
    variables,
    pollInterval,
    fetchPolicy: "no-cache",
  });

  useEffect(() => {
    if (pollInterval) {
      r.startPolling(pollInterval);
    }
  }, [r, pollInterval]);

  return r;
}
