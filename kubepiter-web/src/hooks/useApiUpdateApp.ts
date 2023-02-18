import { gql, MutationHookOptions, useMutation } from "@apollo/client";
import { GqlAppInput, GqlMutation } from "../generated/graphql";

const MUTATION_UPDATE_APP = gql`
  mutation updateApp($id: ID!, $value: AppInput!) {
    updateApp(id: $id, value: $value)
  }
`;

interface UpdateApiVariable {
  id: string;
  value: GqlAppInput;
}

export default function useApiUpdateApp(
  options?: MutationHookOptions<GqlMutation, UpdateApiVariable>
) {
  return useMutation<GqlMutation, UpdateApiVariable>(
    MUTATION_UPDATE_APP,
    options
  );
}
