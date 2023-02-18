import { Environment } from 'src/Environment';
import getDatabaseConnection from 'src/drivers/databases/DatabaseInstance';

export default async function preventMongoDbIdle() {
  if (Environment.MONGODB_PREVENT_IDLE) {
    const db = getDatabaseConnection();
    await db.updateSetting('prevent_mongodb_idle', Math.floor(Date.now() / 1000));
  }
}
