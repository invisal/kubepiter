import { gql, useQuery } from "@apollo/client";
import { GqlQuery } from "../generated/graphql";

const QUERY_APP_LIST = gql`
  query appList {
    apps {
      id
      version
      currentVersion
      replicas
      name
      folderName
      ingress {
        host
        path
      }
      lastBuildJob {
        id
        status
      }
    }
  }
`;

export default function useApiAppList() {
  return useQuery<GqlQuery>(QUERY_APP_LIST);
}
