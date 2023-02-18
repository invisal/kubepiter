import cron from 'node-cron';
import logger from 'src/global/logger';
import enforceKeepNthImagePolicy from './enforceKeepNthImagePolicy';
import preventMongoDbIdle from './preventMongodbIdle';

export default class CronManager {
  start() {
    cron.schedule('0 0 0 * * *', async () => {
      try {
        await enforceKeepNthImagePolicy();
      } catch (e) {
        logger.error(e.message);
      }
    });

    cron.schedule('0 * * * * *', async () => {
      try {
        await preventMongoDbIdle();
      } catch (e) {
        logger.error(e.message);
      }
    });
  }
}
