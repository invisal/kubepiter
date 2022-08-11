import { VariableValues } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-express';
import { DocumentNode } from 'graphql';
import { GqlMutation, GqlQuery } from '../generated/graphql';
import GraphQLResolvers from '../graphql/GraphQLResolvers';
import GraphQLTypeDefs from '../graphql/GraphQLTypeDefs';
import GraphContext from '../types/GraphContext';

export default function createApolloTestServer(context: Partial<GraphContext>) {
  const server = new ApolloServer({
    typeDefs: GraphQLTypeDefs,
    resolvers: GraphQLResolvers,
    context: () => context,
  });

  return Object.freeze({
    query: async (query: string | DocumentNode, variables?: VariableValues) => {
      const { data, errors } = await server.executeOperation({ query, variables });

      return {
        data: data as GqlQuery,
        errors,
      };
    },

    mutate: async (query: string | DocumentNode, variables?: VariableValues) => {
      const { data, errors } = await server.executeOperation({ query, variables });

      return {
        data: data as GqlMutation,
        errors,
      };
    },
  });
}
