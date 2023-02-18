import { gql, useQuery } from "@apollo/client";
import { GqlQuery } from "src/generated/graphql";

const QUERY_POD_LIST = gql`
  query pods($appId: String) {
    pods(appId: $appId) {
      name
      status
    }
  }
`;

export default function useApiPodList(variables: { appId: string }) {
  return useQuery<GqlQuery>(QUERY_POD_LIST, { variables });
}
