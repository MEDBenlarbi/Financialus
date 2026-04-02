import { FastifyInstance } from 'fastify'

export default async function usersRoutes(app: FastifyInstance) {
  app.get('/me', {
    preHandler: [app.authenticate],
  }, async (req) => {
    const user = await app.prisma.user.findUnique({
      where: { id: req.user.userId },
      include: {
        homes: {
          include: {
            home: true,
          },
        },
      },
    })
    return user
  })
}