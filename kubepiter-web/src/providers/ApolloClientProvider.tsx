import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
  split,
} from "@apollo/client";
import { PropsWithChildren, useMemo } from "react";
import { useSessionToken } from "./SessionTokenProvider";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { createClient } from "graphql-ws";

function createApolloClient(token: string | null) {
  const endpoint = `${(window as any).envs.endpoint}/graphql`;

  const wsLink = new GraphQLWsLink(
    createClient({
      url: "ws" + endpoint.substring(4),
      connectionParams: {
        authToken: token,
      },
    })
  );

  const httpLink = new HttpLink({
    uri: endpoint,
    headers: token
      ? {
          Authorization: "Bearer " + token,
        }
      : {},
  });

  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === "OperationDefinition" &&
        definition.operation === "subscription"
      );
    },
    wsLink,
    httpLink
  );

  const client = new ApolloClient({
    uri: endpoint,
    link: splitLink,
    cache: new InMemoryCache(),
    ssrMode: false,
  });

  return client;
}

export function ApolloClientProvider(props: PropsWithChildren<unknown>) {
  const { token } = useSessionToken();
  const client = useMemo(() => createApolloClient(token), [token]);

  return <ApolloProvider client={client}>{props.children}</ApolloProvider>;
}
