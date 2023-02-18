import { gql, useQuery } from "@apollo/client";
import { GqlQuery } from "../generated/graphql";

const QUERY_NODE_LIST = gql`
  query nodes {
    nodes {
      name
      labels
      memoryUsage {
        capacity
        limit
        request
        usage
        allocatable
      }
      cpuUsage {
        capacity
        limit
        request
        usage
        allocatable
      }
    }
  }
`;

export default function useApiNodeList() {
  return useQuery<GqlQuery>(QUERY_NODE_LIST);
}
