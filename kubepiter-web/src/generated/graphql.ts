export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  JSON: any;
};

export type GqlApp = {
  __typename?: 'App';
  cluster?: Maybe<Scalars['String']>;
  currentVersion?: Maybe<Scalars['Int']>;
  dockerfilePath?: Maybe<Scalars['String']>;
  env?: Maybe<Array<Maybe<GqlAppEnvironmentVariable>>>;
  folderName?: Maybe<Scalars['String']>;
  git?: Maybe<GqlAppGit>;
  gitWebhook?: Maybe<Scalars['String']>;
  hasChanged?: Maybe<Scalars['Boolean']>;
  id?: Maybe<Scalars['ID']>;
  image?: Maybe<Scalars['String']>;
  imagePullSecret?: Maybe<Scalars['String']>;
  ingress?: Maybe<Array<Maybe<GqlAppIngress>>>;
  ingressBodySize?: Maybe<Scalars['Float']>;
  lastBuildJob?: Maybe<GqlBuildJob>;
  name?: Maybe<Scalars['String']>;
  namespace?: Maybe<Scalars['String']>;
  nodeGroup?: Maybe<Scalars['String']>;
  port?: Maybe<Scalars['Int']>;
  replicas?: Maybe<Scalars['Int']>;
  resourceUsage?: Maybe<GqlResourceUsageDetail>;
  resources?: Maybe<GqlAppResource>;
  staticVersion?: Maybe<Scalars['String']>;
  version?: Maybe<Scalars['Int']>;
  yamlDeployment?: Maybe<Scalars['String']>;
  yamlIngress?: Maybe<Scalars['String']>;
  yamlService?: Maybe<Scalars['String']>;
};

export type GqlAppEnvironmentVariable = {
  __typename?: 'AppEnvironmentVariable';
  name: Scalars['String'];
  value: Scalars['String'];
};

export type GqlAppEnvironmentVariableInput = {
  name: Scalars['String'];
  value: Scalars['String'];
};

export type GqlAppGit = {
  __typename?: 'AppGit';
  branch?: Maybe<Scalars['String']>;
  hasAuth?: Maybe<Scalars['Boolean']>;
  url?: Maybe<Scalars['String']>;
};

export type GqlAppGitInput = {
  branch?: InputMaybe<Scalars['String']>;
  password?: InputMaybe<Scalars['String']>;
  url?: InputMaybe<Scalars['String']>;
  username?: InputMaybe<Scalars['String']>;
};

export type GqlAppIngress = {
  __typename?: 'AppIngress';
  host?: Maybe<Scalars['String']>;
  path?: Maybe<Scalars['String']>;
};

export type GqlAppIngressInput = {
  host: Scalars['String'];
  path: Scalars['String'];
};

export type GqlAppInput = {
  cluster?: InputMaybe<Scalars['String']>;
  dockerfilePath?: InputMaybe<Scalars['String']>;
  env?: InputMaybe<Array<InputMaybe<GqlAppEnvironmentVariableInput>>>;
  folderName?: InputMaybe<Scalars['String']>;
  git?: InputMaybe<GqlAppGitInput>;
  image?: InputMaybe<Scalars['String']>;
  imagePullSecret?: InputMaybe<Scalars['String']>;
  ingress?: InputMaybe<Array<InputMaybe<GqlAppIngressInput>>>;
  ingressBodySize?: InputMaybe<Scalars['Float']>;
  name?: InputMaybe<Scalars['String']>;
  namespace?: InputMaybe<Scalars['String']>;
  nodeGroup?: InputMaybe<Scalars['String']>;
  port?: InputMaybe<Scalars['Int']>;
  replicas?: InputMaybe<Scalars['Int']>;
  resources?: InputMaybe<GqlAppResourceInput>;
  staticVersion?: InputMaybe<Scalars['String']>;
  version?: InputMaybe<Scalars['Int']>;
};

export type GqlAppResource = {
  __typename?: 'AppResource';
  limits?: Maybe<GqlAppResourceQuota>;
  requests?: Maybe<GqlAppResourceQuota>;
};

export type GqlAppResourceInput = {
  limits?: InputMaybe<GqlAppResourceQuotaInput>;
  requests?: InputMaybe<GqlAppResourceQuotaInput>;
};

export type GqlAppResourceQuota = {
  __typename?: 'AppResourceQuota';
  cpu?: Maybe<Scalars['Float']>;
  memory?: Maybe<Scalars['Int']>;
};

export type GqlAppResourceQuotaInput = {
  cpu?: InputMaybe<Scalars['Float']>;
  memory?: InputMaybe<Scalars['Int']>;
};

export type GqlBuildJob = {
  __typename?: 'BuildJob';
  appId?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['Int']>;
  endAt?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['ID']>;
  logs?: Maybe<Scalars['String']>;
  startAt?: Maybe<Scalars['Int']>;
  status?: Maybe<Scalars['String']>;
  version?: Maybe<Scalars['String']>;
};

export type GqlComponent = {
  __typename?: 'Component';
  installed?: Maybe<Scalars['Boolean']>;
  name?: Maybe<GqlComponentName>;
  required?: Maybe<Scalars['Boolean']>;
};

export enum GqlComponentName {
  LetencryptManager = 'LETENCRYPT_MANAGER',
  MetricServer = 'METRIC_SERVER',
  NginxIngress = 'NGINX_INGRESS'
}

export type GqlCreateUserResponse = {
  __typename?: 'CreateUserResponse';
  id?: Maybe<Scalars['ID']>;
  password?: Maybe<Scalars['String']>;
};

export type GqlDeployResponse = {
  __typename?: 'DeployResponse';
  message?: Maybe<Scalars['String']>;
  yaml?: Maybe<Scalars['String']>;
};

export type GqlKubeNode = {
  __typename?: 'KubeNode';
  cpuUsage?: Maybe<GqlResourceUsage>;
  labels?: Maybe<Scalars['JSON']>;
  memoryUsage?: Maybe<GqlResourceUsage>;
  name?: Maybe<Scalars['String']>;
};

export type GqlLoginResponse = {
  __typename?: 'LoginResponse';
  token?: Maybe<Scalars['String']>;
};

export type GqlMutation = {
  __typename?: 'Mutation';
  changePassword?: Maybe<Scalars['Boolean']>;
  createApp?: Maybe<Scalars['String']>;
  createRegistry?: Maybe<Scalars['String']>;
  createUser?: Maybe<GqlCreateUserResponse>;
  deleteApp?: Maybe<Scalars['Boolean']>;
  deleteRegistry?: Maybe<Scalars['Boolean']>;
  deleteUser?: Maybe<Scalars['Boolean']>;
  deployApp?: Maybe<GqlDeployResponse>;
  enforceKeepNthPolicy?: Maybe<Scalars['Boolean']>;
  login?: Maybe<GqlLoginResponse>;
  regenerateAppWebhook?: Maybe<Scalars['String']>;
  rollbackApp?: Maybe<Scalars['Boolean']>;
  setupOwnerAccount?: Maybe<Scalars['Boolean']>;
  updateApp?: Maybe<Scalars['Boolean']>;
  updateRegistry?: Maybe<Scalars['Boolean']>;
  updateUser?: Maybe<Scalars['Boolean']>;
};


export type GqlMutationChangePasswordArgs = {
  newPassword: Scalars['String'];
  oldPassword: Scalars['String'];
};


export type GqlMutationCreateAppArgs = {
  name: Scalars['String'];
};


export type GqlMutationCreateRegistryArgs = {
  value?: InputMaybe<GqlRegistryInput>;
};


export type GqlMutationCreateUserArgs = {
  value: GqlUserInput;
};


export type GqlMutationDeleteAppArgs = {
  id: Scalars['ID'];
};


export type GqlMutationDeleteRegistryArgs = {
  force?: InputMaybe<Scalars['Boolean']>;
  name: Scalars['String'];
};


export type GqlMutationDeleteUserArgs = {
  id: Scalars['ID'];
};


export type GqlMutationDeployAppArgs = {
  build?: InputMaybe<Scalars['Boolean']>;
  deploy?: InputMaybe<Scalars['Boolean']>;
  id: Scalars['ID'];
};


export type GqlMutationLoginArgs = {
  password: Scalars['String'];
  ttl?: InputMaybe<Scalars['Int']>;
  username: Scalars['String'];
};


export type GqlMutationRegenerateAppWebhookArgs = {
  id: Scalars['ID'];
};


export type GqlMutationRollbackAppArgs = {
  appId: Scalars['ID'];
  version?: InputMaybe<Scalars['Int']>;
};


export type GqlMutationSetupOwnerAccountArgs = {
  password?: InputMaybe<Scalars['String']>;
  username?: InputMaybe<Scalars['String']>;
};


export type GqlMutationUpdateAppArgs = {
  id: Scalars['ID'];
  value?: InputMaybe<GqlAppInput>;
};


export type GqlMutationUpdateRegistryArgs = {
  name: Scalars['String'];
  value?: InputMaybe<GqlRegistryInput>;
};


export type GqlMutationUpdateUserArgs = {
  id: Scalars['ID'];
  value: GqlUserInput;
};

export type GqlNodeGroup = {
  __typename?: 'NodeGroup';
  description?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  selector?: Maybe<Scalars['JSON']>;
  tag: Scalars['ID'];
};

export type GqlPod = {
  __typename?: 'Pod';
  name?: Maybe<Scalars['String']>;
  podScheduledTime?: Maybe<Scalars['String']>;
  raw?: Maybe<Scalars['JSON']>;
  status?: Maybe<Scalars['String']>;
};

export type GqlQuery = {
  __typename?: 'Query';
  app?: Maybe<GqlApp>;
  apps?: Maybe<Array<Maybe<GqlApp>>>;
  buildLog?: Maybe<GqlBuildJob>;
  buildLogs?: Maybe<Array<Maybe<GqlBuildJob>>>;
  components?: Maybe<Array<Maybe<GqlComponent>>>;
  me?: Maybe<GqlUser>;
  nodeGroups?: Maybe<Array<Maybe<GqlNodeGroup>>>;
  nodes?: Maybe<Array<Maybe<GqlKubeNode>>>;
  pod?: Maybe<GqlPod>;
  podLog?: Maybe<Scalars['String']>;
  pods?: Maybe<Array<Maybe<GqlPod>>>;
  registries?: Maybe<Array<Maybe<GqlRegistry>>>;
  registryManifest?: Maybe<GqlRegistryManifest>;
  registryRepoTags?: Maybe<Array<Maybe<GqlRegistryRepositoryTag>>>;
  registryRepos?: Maybe<Array<Maybe<GqlRegistryRepository>>>;
  setupStatus?: Maybe<GqlSetupStatus>;
  user?: Maybe<GqlUser>;
  users?: Maybe<Array<Maybe<GqlUser>>>;
  version?: Maybe<Scalars['String']>;
};


export type GqlQueryAppArgs = {
  id: Scalars['ID'];
};


export type GqlQueryBuildLogArgs = {
  id: Scalars['ID'];
};


export type GqlQueryBuildLogsArgs = {
  appId?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  status?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};


export type GqlQueryPodArgs = {
  name: Scalars['String'];
};


export type GqlQueryPodLogArgs = {
  name: Scalars['String'];
  tailLines?: InputMaybe<Scalars['Int']>;
};


export type GqlQueryPodsArgs = {
  appId?: InputMaybe<Scalars['String']>;
};


export type GqlQueryRegistryManifestArgs = {
  registryName: Scalars['String'];
  repositoryName: Scalars['String'];
  tag?: InputMaybe<Scalars['String']>;
};


export type GqlQueryRegistryRepoTagsArgs = {
  registryName: Scalars['String'];
  repositoryName: Scalars['String'];
};


export type GqlQueryRegistryReposArgs = {
  registryName: Scalars['String'];
};


export type GqlQueryUserArgs = {
  id: Scalars['ID'];
};

export type GqlRegistry = {
  __typename?: 'Registry';
  auth?: Maybe<Scalars['String']>;
  endpoint?: Maybe<Scalars['String']>;
  managed?: Maybe<Scalars['Boolean']>;
  name: Scalars['ID'];
  policyKeepNthImage?: Maybe<Scalars['Int']>;
  totalAppUsed?: Maybe<Scalars['Int']>;
  urlPrefix?: Maybe<Scalars['String']>;
};

export type GqlRegistryInput = {
  endpoint?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['ID']>;
  password?: InputMaybe<Scalars['String']>;
  policyKeepNthImage?: InputMaybe<Scalars['Int']>;
  urlPrefix?: InputMaybe<Scalars['String']>;
  username?: InputMaybe<Scalars['String']>;
};

export type GqlRegistryManifest = {
  __typename?: 'RegistryManifest';
  contentDiggest?: Maybe<Scalars['String']>;
  layers?: Maybe<Array<Maybe<GqlRegistryManifestLayer>>>;
  size?: Maybe<Scalars['Int']>;
};

export type GqlRegistryManifestLayer = {
  __typename?: 'RegistryManifestLayer';
  contentDiggest?: Maybe<Scalars['String']>;
  size?: Maybe<Scalars['Int']>;
};

export type GqlRegistryRepository = {
  __typename?: 'RegistryRepository';
  name?: Maybe<Scalars['String']>;
};

export type GqlRegistryRepositoryTag = {
  __typename?: 'RegistryRepositoryTag';
  name?: Maybe<Scalars['String']>;
};

export type GqlResourceUsage = {
  __typename?: 'ResourceUsage';
  allocatable?: Maybe<Scalars['Float']>;
  capacity?: Maybe<Scalars['Float']>;
  limit?: Maybe<Scalars['Float']>;
  request?: Maybe<Scalars['Float']>;
  usage?: Maybe<Scalars['Float']>;
};

export type GqlResourceUsageDetail = {
  __typename?: 'ResourceUsageDetail';
  cpu?: Maybe<GqlResourceUsage>;
  memory?: Maybe<GqlResourceUsage>;
  totalPod?: Maybe<Scalars['Int']>;
};

export type GqlSetupStatus = {
  __typename?: 'SetupStatus';
  hasOwnerSetup?: Maybe<Scalars['Boolean']>;
};

export type GqlSubscription = {
  __typename?: 'Subscription';
  buildQueueChanged?: Maybe<Array<Maybe<GqlBuildJob>>>;
};

export type GqlUser = {
  __typename?: 'User';
  id?: Maybe<Scalars['ID']>;
  role?: Maybe<Scalars['String']>;
  username?: Maybe<Scalars['String']>;
};

export type GqlUserInput = {
  username?: InputMaybe<Scalars['String']>;
};
