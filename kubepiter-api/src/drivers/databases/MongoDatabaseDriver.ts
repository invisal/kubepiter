import { Db, MongoClient, ObjectId, WithId } from 'mongodb';
import { GqlDeployment } from 'src/generated/graphql';
import {
  KubepiterUserToken,
  KubepiterBuilderSetting,
  KubepiterNodeGroup,
  KubepiterApp,
  KubepiterUser,
  KubepiterEventLog,
} from '../../types/common';
import DatabaseInterface from './DatabaseInterface';

export default class MongoDatabaseDriver extends DatabaseInterface {
  protected client: MongoClient;
  protected db: Db;
  protected databaseName: string;

  constructor(client: MongoClient, databaseName: string) {
    super();
    this.client = client;
    this.databaseName = databaseName;
  }

  protected async getConnection() {
    if (!this.db) {
      this.db = (await this.client.connect()).db(this.databaseName);
    }
    return this.db;
  }

  async getAppById(id: string): Promise<KubepiterApp> {
    const db = await this.getConnection();
    return db.collection('apps').findOne<KubepiterApp>({ id });
  }

  async createApp(id: string, value: Partial<KubepiterApp>): Promise<boolean> {
    const db = await this.getConnection();
    await db.collection('apps').insertOne({ ...value, id });
    return true;
  }

  async deleteApp(id: string) {
    const db = await this.getConnection();
    const result = await db.collection('apps').deleteOne({ id });
    return result.acknowledged;
  }

  async getAppList(): Promise<KubepiterApp[]> {
    const db = await this.getConnection();
    const cursor = db.collection<KubepiterApp>('apps').find();
    return cursor.toArray();
  }

  async updatePartialAppById(id: string, partialValue: Partial<KubepiterApp>): Promise<boolean> {
    const db = await this.getConnection();
    await db.collection('apps').updateOne({ id }, { $set: partialValue });
    return true;
  }

  async getUserByUsername(username: string): Promise<KubepiterUser> {
    const db = await this.getConnection();
    const r = await db.collection('users').findOne<WithId<KubepiterUser>>({ username });

    if (!r) return null;

    return {
      ...r,
      id: r._id.toString(),
    };
  }

  async getOwner(): Promise<KubepiterUser> {
    const db = await this.getConnection();
    const r = await db.collection('users').findOne<WithId<KubepiterUser>>({ role: 'OWNER' });

    if (!r) return undefined;

    return {
      ...r,
      id: r._id.toString(),
    };
  }

  async getUserById(id: string): Promise<KubepiterUser> {
    const db = await this.getConnection();
    const r = await db.collection('users').findOne<WithId<KubepiterUser>>({ _id: new ObjectId(id) });

    if (!r) return undefined;

    return {
      ...r,
      id: r._id.toString(),
    };
  }

  async getUserToken(token: string): Promise<KubepiterUserToken> {
    const db = await this.getConnection();
    return db.collection('user_tokens').findOne<WithId<KubepiterUserToken>>({ token });
  }

  async insertUserToken(token: string, userId: string, ttl: number): Promise<boolean> {
    const expireAt = new Date(new Date().getTime() + (ttl * 1000 || 24 * 60 * 60 * 1000));

    await this.db.collection('user_tokens').insertOne({
      token,
      userId,
      expireAt,
    });

    return true;
  }

  async getUserList(): Promise<KubepiterUser[]> {
    const db = await this.getConnection();
    const cursor = db.collection<KubepiterUser>('users').find();
    return (await cursor.toArray()).map((user) => ({ ...user, id: user._id.toString() }));
  }

  async insertUser(value: Partial<KubepiterUser>): Promise<string> {
    const db = await this.getConnection();
    const result = await db.collection('users').insertOne(value);
    return result.insertedId.toString();
  }

  async updateUser(id: string, value: Partial<KubepiterUser>): Promise<boolean> {
    const db = await this.getConnection();
    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(id) },
      {
        $set: value,
      },
    );

    return result.acknowledged;
  }

  async deleteUser(id: string) {
    const db = await this.getConnection();
    const result = await db.collection('users').deleteOne({ _id: new ObjectId(id) });
    return result.acknowledged;
  }

  async getNodeGroup(tag: string): Promise<KubepiterNodeGroup | undefined> {
    const db = await this.getConnection();
    return db.collection('node_groups').findOne<KubepiterNodeGroup>({ tag });
  }

  async getNodeGroupList(): Promise<KubepiterNodeGroup[]> {
    const db = await this.getConnection();
    const cursor = db.collection<KubepiterNodeGroup>('node_groups').find();
    return cursor.toArray();
  }

  async getBuilderSetting(): Promise<KubepiterBuilderSetting> {
    const db = await this.getConnection();
    const buildSetting = await db
      .collection('setting')
      .findOne<{ value: KubepiterBuilderSetting }>({ name: 'builder' });

    if (!buildSetting) return {};
    return buildSetting.value;
  }

  async updateSetting<T>(optionName: string, value: T): Promise<boolean> {
    const db = await this.getConnection();
    const result = await db.collection('setting').updateOne(
      { name: optionName },
      {
        $set: { last_update_time: value },
      },
      {
        upsert: true,
      },
    );

    return result.acknowledged;
  }

  // Deployment Log
  async createDeployment(value: Partial<GqlDeployment>): Promise<string> {
    const db = await this.getConnection();
    const result = await db.collection('deployments').insertOne(value);
    return result.insertedId.toString();
  }

  async updateDeployment(id: string, value: Partial<GqlDeployment>): Promise<boolean> {
    const db = await this.getConnection();
    const result = await db.collection('deployments').updateOne(
      { _id: new ObjectId(id) },
      {
        $set: value,
      },
    );

    return result.acknowledged;
  }

  async getDeployment(id: string): Promise<GqlDeployment> {
    const db = await this.getConnection();
    return await db.collection('deployments').findOne<GqlDeployment>({ _id: new ObjectId(id) });
  }

  async getDeploymentList(condition: { appId?: string }, offset: number, limit: number): Promise<GqlDeployment[]> {
    const db = await this.getConnection();
    const cursor = db
      .collection<GqlDeployment>('build_logs')
      .find({
        ...(condition.appId ? { appId: condition.appId } : undefined),
      } as unknown)
      .sort({
        createdAt: -1,
      })
      .skip(offset)
      .limit(limit);
    return cursor.toArray();
  }

  // Cron event log
  async insertEventLog(value: Partial<KubepiterEventLog>): Promise<string> {
    const db = await this.getConnection();
    const result = await db.collection('event_logs').insertOne(value);
    return result.insertedId.toString();
  }

  async getEventLogList(offset: number, limit: number): Promise<KubepiterEventLog[]> {
    const db = await this.getConnection();
    const cursor = db
      .collection<KubepiterEventLog>('event_logs')
      .find()
      .sort({
        createdAt: -1,
      })
      .skip(offset)
      .limit(limit);

    return cursor.toArray();
  }
}
