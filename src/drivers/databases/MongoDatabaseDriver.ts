import { Db, MongoClient, WithId } from 'mongodb';
import {
  KubepiterUserToken,
  KubepiterBuilderSetting,
  KubepiterBuildJobLog,
  KubepiterNodeGroup,
  KubeboxApp,
  KubepiterUser,
} from '../../types/common';
import DatabaseInterface from './DatabaseInterface';

export default class MongoDatabaseDriver extends DatabaseInterface {
  protected connectionString: string;
  protected connection: MongoClient;
  protected db: Db;

  constructor(connectionString: string, certFile?: string) {
    super();
    this.connectionString = connectionString;

    this.connection = new MongoClient(connectionString, {
      tlsCAFile: certFile,
    });
  }

  protected async getConnection() {
    if (!this.db) {
      this.db = (await this.connection.connect()).db('kubebox');
    }

    return this.db;
  }

  async getAppById(id: string): Promise<KubeboxApp> {
    const db = await this.getConnection();
    return await db.collection('apps').findOne<KubeboxApp>({ id });
  }

  async createApp(id: string, value: Partial<KubeboxApp>): Promise<boolean> {
    const db = await this.getConnection();
    await db.collection('apps').insertOne({ ...value, id });
    return true;
  }

  async getAppList(): Promise<KubeboxApp[]> {
    const db = await this.getConnection();
    const cursor = db.collection<KubeboxApp>('apps').find();
    return await cursor.toArray();
  }

  async updatePartialAppById(id: string, partialValue: Partial<KubeboxApp>): Promise<boolean> {
    const db = await this.getConnection();
    await db.collection('apps').updateOne({ id }, { $set: partialValue });
    return true;
  }

  async getUserByUsername(username: string): Promise<KubepiterUser> {
    const db = await this.getConnection();
    return await db.collection('users').findOne<KubepiterUser>({ username });
  }

  async getUserById(id: string): Promise<KubepiterUser> {
    const db = await this.getConnection();
    return await db.collection('users').findOne<KubepiterUser>({ id });
  }

  async getUserToken(token: string): Promise<KubepiterUserToken> {
    const db = await this.getConnection();
    return await db.collection('user_tokens').findOne<WithId<KubepiterUserToken>>({ token });
  }

  async createUserToken(token: string, userId: string, ttl: number): Promise<boolean> {
    const expireAt = new Date(new Date().getTime() + (ttl * 1000 || 24 * 60 * 60 * 1000));

    await this.db.collection('user_tokens').insertOne({
      token,
      userId,
      expireAt,
    });

    return true;
  }

  async getNodeGroup(tag: string): Promise<KubepiterNodeGroup | undefined> {
    return await this.db.collection('node_groups').findOne<KubepiterNodeGroup>({ tag });
  }

  async getNodeGroupList(): Promise<KubepiterNodeGroup[]> {
    const db = await this.getConnection();
    const cursor = db.collection<KubepiterNodeGroup>('node_groups').find();
    return await cursor.toArray();
  }

  async getBuilderSetting(): Promise<KubepiterBuilderSetting> {
    return (await this.db.collection('setting').findOne<{ value: KubepiterBuilderSetting }>({ name: 'builder' })).value;
  }

  async updateBuildLog(id: string, log: KubepiterBuildJobLog): Promise<boolean> {
    await this.db.collection('build_logs').updateOne(
      {
        id,
      },
      {
        $set: log,
      },
    );

    return true;
  }

  async getBuildLog(id: string): Promise<KubepiterBuildJobLog> {
    const db = await this.getConnection();
    return await db.collection('build_logs').findOne<KubepiterBuildJobLog>({ id });
  }

  async getBuildLogList(condition: { appId?: string }, offset: number, limit: number): Promise<KubepiterBuildJobLog[]> {
    const db = await this.getConnection();
    const cursor = db
      .collection<KubepiterBuildJobLog>('build_logs')
      .find(condition?.appId ? condition : undefined)
      .sort({
        createdAt: -1,
      })
      .skip(offset)
      .limit(limit);
    return await cursor.toArray();
  }

  async insertBuildLog(log: KubepiterBuildJobLog): Promise<string> {
    await this.db.collection('build_logs').insertOne(log);
    return log.id;
  }
}
