import { gql, MutationHookOptions, useMutation } from "@apollo/client";
import { GqlMutation } from "../generated/graphql";

const MUTATION_DEPLOY_APP = gql`
  mutation deployApp($id: ID!, $build: Boolean, $deploy: Boolean) {
    deployApp(id: $id, build: $build, deploy: $deploy) {
      message
    }
  }
`;

interface DeployApiVariable {
  id: string;
  build: boolean;
  deploy: boolean;
}

export default function useApiDeployApp(
  options?: MutationHookOptions<GqlMutation, DeployApiVariable>
) {
  return useMutation<GqlMutation, DeployApiVariable>(
    MUTATION_DEPLOY_APP,
    options
  );
}
