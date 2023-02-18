import { MongoClient } from 'mongodb';
import { Environment } from '../../Environment';
import { KubepiterDeploymentLog } from '../../types/common';
import MongoDatabaseDriver from './MongoDatabaseDriver';

let client: MongoClient;

afterAll(async () => {
  await client.close();
});

beforeAll(async () => {
  client = new MongoClient(Environment.MONGODB_CONNECTION);
  await client.connect();
  await client.db(Environment.MONGODB_DB).dropDatabase();
});

describe('Mongo Database Driver', () => {
  it('User CRUD', async () => {
    const db = new MongoDatabaseDriver(client, Environment.MONGODB_DB);

    // Insert and get
    const USER = { username: 'kubepiter' };
    const id = await db.insertUser(USER);
    const userAfterInsert = await db.getUserById(id);
    expect(userAfterInsert.username).toBe(USER.username);

    // Update
    const USER_NEW_USERNAME = 'kube';
    await db.updateUser(id, { username: USER_NEW_USERNAME });
    const userAfterUpdate = await db.getUserById(id);
    expect(userAfterUpdate.username).toBe(USER_NEW_USERNAME);

    // Delete
    await db.deleteUser(id);
    const userAfterDelete = await db.getUserById(id);
    expect(userAfterDelete).toBeUndefined();

    await db.insertUser({ username: 'user1' });
    await db.insertUser({ username: 'user2' });
    const userList = await db.getUserList();
    expect(userList.length).toBe(2);
  });

  it('Deployment CRUD', async () => {
    const db = new MongoDatabaseDriver(client, Environment.MONGODB_DB);

    // Insert and get
    const DEPLOYMENT_LOG: Partial<KubepiterDeploymentLog> = {
      appId: 'appid123',
      ingressResponse: 'ingress response',
      ingressSuccess: true,
      ingressYaml: 'ingress yaml',
      serviceResponse: 'service response',
      serviceSuccess: true,
      serviceYaml: 'service yaml',
      deploymentResponse: 'deployment response',
      deploymentSuccess: true,
      deploymentYaml: 'deployment yaml',
    };

    const id = await db.insertDeploymentLog(DEPLOYMENT_LOG);
    const deployment = await db.getDeploymentLog(id);
    expect(deployment).toMatchObject(DEPLOYMENT_LOG);

    // Get list from appId
    const deploymentList = await db.getDeploymentLogList({ appId: DEPLOYMENT_LOG.appId }, 0, 10);
    expect(deploymentList.length).toBe(1);

    // Get list from non-exisit appId
    const deploymentList2 = await db.getDeploymentLogList({ appId: 'some_invalid_app_id' }, 0, 10);
    expect(deploymentList2.length).toBe(0);
  });
});
