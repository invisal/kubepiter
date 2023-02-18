import { gql, useQuery } from "@apollo/client";
import { GqlQuery } from "../generated/graphql";

const QUERY_NODE_GROUP_LIST = gql`
  query nodeGroups {
    nodeGroups {
      tag
      name
      description
      selector
    }
  }
`;

export default function useApiNodeGroupList() {
  return useQuery<GqlQuery>(QUERY_NODE_GROUP_LIST);
}
