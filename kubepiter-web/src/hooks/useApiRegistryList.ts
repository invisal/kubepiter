import { gql, useQuery } from "@apollo/client";
import { GqlQuery } from "../generated/graphql";

const QUERY_REGISTRY_LIST = gql`
  query registries {
    registries {
      name
      auth
      managed
      totalAppUsed
      urlPrefix
    }
  }
`;

export default function useApiRegistryList() {
  return useQuery<GqlQuery>(QUERY_REGISTRY_LIST);
}
