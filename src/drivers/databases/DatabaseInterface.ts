import {
  KubepiterUserToken,
  KubepiterBuilderSetting,
  KubepiterBuildJobLog,
  KubepiterNodeGroup,
  KubepiterApp,
  KubepiterUser,
} from '../../types/common';

export default abstract class DatabaseInterface {
  // App
  abstract getAppById(id: string): Promise<KubepiterApp>;
  abstract getAppList(): Promise<KubepiterApp[]>;
  abstract updatePartialAppById(id: string, partialValue: Partial<KubepiterApp>): Promise<boolean>;

  abstract createApp(id: string, value: Partial<KubepiterApp>): Promise<boolean>;

  // User
  abstract getUserByUsername(username: string): Promise<KubepiterUser>;
  abstract getUserById(id: string): Promise<KubepiterUser>;
  abstract getUserToken(token: string): Promise<KubepiterUserToken>;
  abstract createUserToken(token: string, userId: string, ttl: number): Promise<boolean>;

  // Node
  abstract getNodeGroup(tag: string): Promise<KubepiterNodeGroup>;
  abstract getNodeGroupList(): Promise<KubepiterNodeGroup[]>;

  // Setting
  abstract insertBuildLog(log: KubepiterBuildJobLog): Promise<string>;
  abstract updateBuildLog(id: string, log: KubepiterBuildJobLog): Promise<boolean>;

  abstract getBuildLog(id: string): Promise<KubepiterBuildJobLog>;
  abstract getBuildLogList(
    condition: { appId?: string },
    offset: number,
    limit: number,
  ): Promise<KubepiterBuildJobLog[]>;

  abstract getBuilderSetting(): Promise<KubepiterBuilderSetting>;
}
