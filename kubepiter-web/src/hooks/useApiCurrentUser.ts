import { gql, useQuery } from "@apollo/client";
import { GqlQuery } from "../generated/graphql";

const QUERY_ME = gql`
  query me {
    me {
      username
    }
  }
`;

export default function useApiCurrentUser() {
  return useQuery<GqlQuery>(QUERY_ME);
}
