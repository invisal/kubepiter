import cron from 'node-cron';
import logger from 'src/global/logger';
import enforceKeepNthImagePolicy from './enforceKeepNthImagePolicy';

export default class CronManager {
  start() {
    cron.schedule('0 0 0 * * *', async () => {
      try {
        await enforceKeepNthImagePolicy();
      } catch (e) {
        logger.error(e.message);
      }
    });
  }
}
