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
import VersionResolver from './resolvers/VersionResolver';
import UserResolver from './resolvers/users/UserResolver';
import CreateUserResolver from './resolvers/users/CreateUserResolver';
import DeleteUserResolver from './resolvers/users/DeleteUserResolver';
import UpdateUserResolver from './resolvers/users/UpdateUserResolver';
import UsersResolver from './resolvers/users/UsersResolver';

const GraphQLResolvers = {
  Query: {
    version: VersionResolver,

    // User
    me: MeResolver,
    user: UserResolver,
    users: UsersResolver,

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

    // User
    createUser: CreateUserResolver,
    deleteUser: DeleteUserResolver,
    updateUser: UpdateUserResolver,
  },
};

export default GraphQLResolvers;
