import { gql, useQuery } from "@apollo/client";
import { GqlQuery } from "src/generated/graphql";

const QUERY_POD = gql`
  query pod($name: String!) {
    pod(name: $name) {
      name
      status
    }
  }
`;

export default function useApiPod(variables: { name: string }) {
  return useQuery<GqlQuery>(QUERY_POD, { variables });
}
