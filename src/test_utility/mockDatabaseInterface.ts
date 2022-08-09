import DatabaseInterface from '../drivers/databases/DatabaseInterface';

export default function mockDatabaseInterface(mock: Partial<DatabaseInterface>): DatabaseInterface {
  return mock as DatabaseInterface;
}
