import { gql, MutationHookOptions, useMutation } from "@apollo/client";
import { GqlMutation } from "../generated/graphql";

const MUTATION_REGENERATE = gql`
  mutation regnerateAppWebhook($id: ID!) {
    regenerateAppWebhook(id: $id)
  }
`;

interface VariableProps {
  id: string;
}

export default function useApiRegenerateWebhook(
  options?: MutationHookOptions<GqlMutation, VariableProps>
) {
  return useMutation(MUTATION_REGENERATE, options);
}
