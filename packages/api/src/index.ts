import fastifyEnv from '@fastify/env';
import Fastify from 'fastify';
import { resolve } from 'node:path';
import { envSchema } from './config/env.schema.js';

const app = Fastify({ logger: true });

const start = async () => {
  try {
    await app.register(fastifyEnv, {
      schema: envSchema,
      dotenv: {
        path: resolve('../../.env'),  // points to root .env file
      },
    });

    app.get('/', async () => {
      return { status: 'Financialus API Operational' };
    });

    await app.listen({
      port: app.config.PORT,
      host: app.config.HOST,
    });

  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();