import AppResolver from './resolvers/apps/AppResolver';
import RegenerateAppWebhookResolver from './resolvers/apps/RegenerateAppWebhookResolver';
import BuildLogResolver from './resolvers/BuildLogResolver';
import BuildLogsResolver from './resolvers/BuildLogsResolver';
import CreateAppResolver from './resolvers/apps/CreateAppResolver';
import LoginResolver from './resolvers/LoginResolver';
import NodeGroupsResolver from './resolvers/NodeGroupsResolver';
import NodesResolver from './resolvers/NodesResolver';
import RegistriesResolver from './resolvers/RegistriesResolver';
import UpdateAppResolver from './resolvers/UpdateAppResolver';
import AppsResolver from './resolvers/apps/AppsResolver';
import DeployAppResolver from './resolvers/apps/DeployAppResolver';
import VersionResolver from './resolvers/VersionResolver';
import { AppResolvers } from './resolvers/users';
import { PodResolvers } from './resolvers/pods';

const OtherResolvers = {
  Query: {
    version: VersionResolver,

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

    // App
    updateApp: UpdateAppResolver,
    createApp: CreateAppResolver,
    deployApp: DeployAppResolver,
    regenerateAppWebhook: RegenerateAppWebhookResolver,
  },
};

const GraphQLResolvers = [OtherResolvers, AppResolvers, PodResolvers];
export default GraphQLResolvers;
