import AppResolver from './resolvers/AppResolver'
import AppsResolver from './resolvers/AppsResolver'
import BuildLogResolver from './resolvers/BuildLogResolver'
import BuildLogsResolver from './resolvers/BuildLogsResolver'
import CreateAppResolver from './resolvers/CreateAppResolver'
import DeployAppResolver from './resolvers/DeployAppResolver'
import LoginResolver from './resolvers/LoginResolver'
import MeResolver from './resolvers/MeResolver'
import NodeGroupsResolver from './resolvers/NodeGroupsResolver'
import NodesResolver from './resolvers/NodesResolver'
import RegistriesResolver from './resolvers/RegistriesResolver'
import UpdateAppResolver from './resolvers/UpdateAppResolver'

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
    nodeGroups: NodeGroupsResolver
  },
  Mutation: {
    login: LoginResolver,
    updateApp: UpdateAppResolver,
    createApp: CreateAppResolver,
    deployApp: DeployAppResolver
  }
}

export default GraphQLResolvers
