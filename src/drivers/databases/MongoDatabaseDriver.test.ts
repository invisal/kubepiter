import { MongoClient } from 'mongodb';
import { Environment } from '../../Environment';
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
});
