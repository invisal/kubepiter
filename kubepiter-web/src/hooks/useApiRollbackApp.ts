import { gql, MutationHookOptions, useMutation } from "@apollo/client";
import { GqlMutation } from "../generated/graphql";

const MUTATION_ROLLBACK_APP = gql`
  mutation rollbackApp($appId: ID!, $version: Int!) {
    rollbackApp(appId: $appId, version: $version)
  }
`;

interface RollbackApiVariable {
  appId: string;
  version: number;
}

export default function useApiRollbackApp(
  options?: MutationHookOptions<GqlMutation, RollbackApiVariable>
) {
  return useMutation(MUTATION_ROLLBACK_APP, options);
}
