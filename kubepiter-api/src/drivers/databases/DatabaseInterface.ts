import { GqlDeployment } from 'src/generated/graphql';
import {
  KubepiterUserToken,
  KubepiterBuilderSetting,
  KubepiterNodeGroup,
  KubepiterApp,
  KubepiterUser,
  KubepiterEventLog,
} from '../../types/common';

export default abstract class DatabaseInterface {
  // App
  abstract getAppById(id: string): Promise<KubepiterApp>;
  abstract getAppList(): Promise<KubepiterApp[]>;
  abstract deleteApp(id: string): Promise<boolean>;
  abstract updatePartialAppById(id: string, partialValue: Partial<KubepiterApp>): Promise<boolean>;

  abstract createApp(id: string, value: Partial<KubepiterApp>): Promise<boolean>;

  // User
  abstract getUserList(): Promise<KubepiterUser[]>;
  abstract getUserByUsername(username: string): Promise<KubepiterUser>;
  abstract getOwner(): Promise<KubepiterUser>;
  abstract getUserById(id: string): Promise<KubepiterUser>;
  abstract insertUser(value: Partial<KubepiterUser>): Promise<string>;
  abstract deleteUser(id: string): Promise<boolean>;
  abstract updateUser(id: string, value: Partial<KubepiterUser>): Promise<boolean>;

  abstract getUserToken(token: string): Promise<KubepiterUserToken>;
  abstract insertUserToken(token: string, userId: string, ttl: number): Promise<boolean>;

  // Node
  abstract getNodeGroup(tag: string): Promise<KubepiterNodeGroup>;
  abstract getNodeGroupList(): Promise<KubepiterNodeGroup[]>;

  // Deployment Log
  abstract createDeployment(value: Partial<GqlDeployment>): Promise<string>;
  abstract updateDeployment(id: string, data: Partial<GqlDeployment>): Promise<boolean>;
  abstract getDeployment(id: string): Promise<GqlDeployment>;
  abstract getDeploymentList(condition: { appId?: string }, offset: number, limit: number): Promise<GqlDeployment[]>;

  // Event log
  abstract insertEventLog(value: Partial<KubepiterEventLog>): Promise<string>;
  abstract getEventLogList(offset: number, limit: number): Promise<KubepiterEventLog[]>;

  // Setting
  abstract getBuilderSetting(): Promise<KubepiterBuilderSetting>;
  abstract updateSetting<T>(optionName: string, value: T): Promise<boolean>;
}
