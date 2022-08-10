import dotenv from 'dotenv';
dotenv.config({ path: `./.env.${process.env.NODE_ENV}` });

export const Environment = Object.freeze({
  HOST: process.env.HOST,
  BASE_URL: process.env.BASE_URL || '',
  DEFAULT_NAMESPACE: process.env.DEFAULT_NAMESPACE || 'default',
  MONGODB_DB: process.env.MONGO_DB,
  MONGODB_CONNECTION: process.env.MONGO_CONNECTION_STRING,
  MONGODB_CRT: process.env.MONGO_CERTICATE_FILE,
  PORT: process.env.PORT,
  KUBECONFIG: process.env.KUBECONFIG,
});
