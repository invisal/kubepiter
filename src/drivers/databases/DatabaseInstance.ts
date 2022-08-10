import { MongoClient } from 'mongodb';
import { Environment } from '../../Environment';
import DatabaseInterface from './DatabaseInterface';
import MongoDatabaseDriver from './MongoDatabaseDriver';

let dbInstance: DatabaseInterface;

export default function getDatabaseConnection() {
  if (dbInstance) {
    return dbInstance;
  }

  if (Environment.MONGODB_CONNECTION) {
    const client = new MongoClient(
      Environment.MONGODB_CONNECTION,
      Environment.MONGODB_CRT
        ? {
            tlsCAFile: Environment.MONGODB_CRT,
          }
        : undefined,
    );

    dbInstance = new MongoDatabaseDriver(client, Environment.MONGODB_DB);
    return dbInstance;
  }

  throw new Error('There is no database driver');
}
