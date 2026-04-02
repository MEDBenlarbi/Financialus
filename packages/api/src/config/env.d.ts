import { PrismaClient } from '@prisma/client';

declare module 'fastify' {
  interface FastifyInstance {
    config: {
      NODE_ENV: string;
      HOST: string;
      PORT: number;
      DATABASE_URL: string;
      JWT_SECRET: string;
    };
    prisma: PrismaClient;
  }
}
declare module 'fastify' {
  interface FastifyInstance {
    config: {
      NODE_ENV: string
      HOST: string
      PORT: number
      DATABASE_URL: string
      JWT_SECRET: string
      GOOGLE_CLIENT_ID: string
      GOOGLE_CLIENT_SECRET: string
      PROTOCOL: string
    }
    prisma: PrismaClient
    authenticate: (req: any, res: any) => Promise<void>
  }
  interface FastifyRequest {
    user: {
      userId: string
      email: string
      fullName: string
    }
  }
}