import { gql, useMutation, useQuery } from "@apollo/client";
import { GqlMutation } from "../generated/graphql";

const MUTATION_LOGIN = gql`
  mutation login($username: String!, $password: String!, $ttl: Int) {
    login(username: $username, password: $password, ttl: $ttl) {
      token
    }
  }
`;

export default function useLogin() {
  return useMutation<GqlMutation>(MUTATION_LOGIN);
}
