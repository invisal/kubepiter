import { gql, useQuery } from "@apollo/client";
import { GqlQuery } from "../generated/graphql";

const QUERY_APP = gql`
  query app($id: ID!) {
    app(id: $id) {
      id
      version
      hasChanged
      currentVersion
      replicas
      name
      image
      imagePullSecret
      dockerfilePath
      folderName
      nodeGroup
      gitWebhook
      port
      ingress {
        host
        path
      }
      ingressBodySize
      env {
        name
        value
      }
      git {
        url
        branch
        hasAuth
      }
      resources {
        limits {
          cpu
          memory
        }
        requests {
          cpu
          memory
        }
      }
      lastBuildJob {
        id
        status
      }
    }
  }
`;

export default function useApiApp(id: string) {
  return useQuery<GqlQuery>(QUERY_APP, {
    variables: { id },
    fetchPolicy: "network-only",
  });
}
