import { gql, MutationHookOptions, useMutation } from "@apollo/client";
import { GqlMutation } from "src/generated/graphql";

const MUTATION_CREATE_APP = gql`
  mutation createApp($name: String!) {
    createApp(name: $name)
  }
`;

interface VariableProps {
  name: string;
}

export default function useApiCreateApp(
  options?: MutationHookOptions<GqlMutation, VariableProps>
) {
  return useMutation(MUTATION_CREATE_APP, options);
}
