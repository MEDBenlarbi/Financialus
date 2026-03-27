declare module 'fastify' {
  interface FastifyInstance {
    config: {
      NODE_ENV: string;
      HOST: string;
      PORT: number;
      DATABASE_URL: string;
      JWT_SECRET: string;
    };
  }
}