import { gql, MutationHookOptions, useMutation } from "@apollo/client";
import { GqlMutation } from "src/generated/graphql";

const MUTATION_CHANGE_PASSWORD = gql`
  mutation changePassword($oldPassword: String!, $newPassword: String!) {
    changePassword(oldPassword: $oldPassword, newPassword: $newPassword)
  }
`;

interface ChangePasswordApiProps {
  newPassword: string;
  oldPassword: string;
}

export default function useApiChangePassword(
  options?: MutationHookOptions<GqlMutation, ChangePasswordApiProps>
) {
  return useMutation(MUTATION_CHANGE_PASSWORD, options);
}
