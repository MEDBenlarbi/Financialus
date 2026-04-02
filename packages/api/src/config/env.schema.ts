export const envSchema = {
  type: 'object',
  required: ['JWT_SECRET', 'GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET'],
  properties: {
    NODE_ENV: {
      type: 'string',
      default: 'development',
    },
    HOST: {
      type: 'string',
      default: 'localhost',
    },
    PORT: {
      type: 'number',
      default: 3000,
    },
    DATABASE_URL: {
      type: 'string',
      default: './packages/api/db/sqlite.db',
    },
    JWT_SECRET: {
      type: 'string',
    },
    GOOGLE_CLIENT_ID: {
      type: 'string',
    },
    GOOGLE_CLIENT_SECRET: {
      type: 'string',
    },
    PROTOCOL: {
      type: 'string',
      default: 'http',
    },
  },
}

