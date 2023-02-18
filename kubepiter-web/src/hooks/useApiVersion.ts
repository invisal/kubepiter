import { gql, useQuery } from "@apollo/client";
import { GqlQuery } from "../generated/graphql";

const QUERY_VERSION = gql`
  query version {
    version
  }
`;

export default function useApiVersion() {
  return useQuery<GqlQuery>(QUERY_VERSION);
}
