import Fastify from 'fastify';

const fastify = Fastify({ logger: true });

// Basic route to test the /api prefix handled by Nginx
fastify.get('/', async (request, reply) => {
  return { status: 'Financialus API Operational' };
});

const start = async () => {
  try {
    // Listen on port 3000 as defined in the Nginx config
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();