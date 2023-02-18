import { gql, useQuery } from "@apollo/client";
import { useEffect } from "react";
import { GqlQuery } from "../generated/graphql";

const QUERY_BUILD_LOGS_LIST = gql`
  query buildLog($id: ID!) {
    buildLog(id: $id) {
      id
      status
      createdAt
      startAt
      endAt
      appId
      logs
      version
    }
  }
`;

export default function useApiBuildLog(id: string) {
  return useQuery<GqlQuery>(QUERY_BUILD_LOGS_LIST, {
    variables: { id },
  });
}
