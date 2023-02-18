import { gql, useQuery } from "@apollo/client";
import { GqlQuery } from "src/generated/graphql";

const QUERY_POD_LOG = gql`
  query podLog($name: String!) {
    podLog(name: $name)
  }
`;

export default function useApiPodLog(variables: { name: string }) {
  return useQuery<GqlQuery>(QUERY_POD_LOG, { variables });
}
