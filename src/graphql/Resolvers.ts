import AppResolver from './resolvers/apps/AppResolver';
import RegenerateAppWebhookResolver from './resolvers/apps/RegenerateAppWebhookResolver';
import BuildLogResolver from './resolvers/BuildLogResolver';
import BuildLogsResolver from './resolvers/BuildLogsResolver';
import CreateAppResolver from './resolvers/apps/CreateAppResolver';
import LoginResolver from './resolvers/LoginResolver';
import MeResolver from './resolvers/MeResolver';
import NodeGroupsResolver from './resolvers/NodeGroupsResolver';
import NodesResolver from './resolvers/NodesResolver';
import RegistriesResolver from './resolvers/RegistriesResolver';
import UpdateAppResolver from './resolvers/UpdateAppResolver';
import AppsResolver from './resolvers/apps/AppsResolver';
import DeployAppResolver from './resolvers/apps/DeployAppResolver';

const GraphQLResolvers = {
  Query: {
    version: () => '1.2.3',
    me: MeResolver,
    apps: AppsResolver,
    app: AppResolver,
    nodes: NodesResolver,

    buildLogs: BuildLogsResolver,
    buildLog: BuildLogResolver,

    registries: RegistriesResolver,
    nodeGroups: NodeGroupsResolver,
  },
  Mutation: {
    login: LoginResolver,
    updateApp: UpdateAppResolver,
    createApp: CreateAppResolver,
    deployApp: DeployAppResolver,
    regenerateAppWebhook: RegenerateAppWebhookResolver,
  },
};

export default GraphQLResolvers;
