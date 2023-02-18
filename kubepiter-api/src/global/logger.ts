import { Environment } from 'src/Environment';
import { createLogger, transports } from 'winston';

const logLevels = {
  fatal: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
  trace: 5,
};

const logger = createLogger({
  levels: logLevels,
  level: Environment.LOG_LEVEL,
  transports: [new transports.Console()],
});

export default logger;
