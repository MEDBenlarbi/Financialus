import { PrismaClient } from '@prisma/client';
import fastifyPlugin from 'fastify-plugin';

const prisma = new PrismaClient();

export default fastifyPlugin(async (app) => {
  await prisma.$connect();

  app.decorate('prisma', prisma);

  app.addHook('onClose', async () => {
    await prisma.$disconnect();
  });
});