import { loadFilesSync } from '@graphql-tools/load-files';

const GraphQLTypeDefs = loadFilesSync('src/graphql/**/*.gql');
export default GraphQLTypeDefs;
