import fastifyEnv from '@fastify/env';
import { config } from 'dotenv';
import Fastify from 'fastify';
import { envSchema } from './config/env.schema.js';
import prismaPlugin from './plugins/prisma.js';

// Load .env manually BEFORE anything else
config({ path: '/home/mbenl/workspaces/financialus/.env' });

const app = Fastify({ logger: true });

const start = async () => {
  try {
    await app.register(fastifyEnv, {
      schema: envSchema,
    });

    await app.register(prismaPlugin);

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