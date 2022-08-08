import dotenv from 'dotenv'
dotenv.config()

export const Environment = Object.freeze({
  HOST: process.env.HOST,
  BASE_URL: process.env.BASE_URL || '',
  DEFAULT_NAMESPACE: process.env.DEFAULT_NAMESPACE || 'default'
})
