import { FastifyInstance } from 'fastify'

export default async function homesRoutes(app: FastifyInstance) {

  app.get('/homes', {
    preHandler: [app.authenticate],
  }, async (req) => {
    const homes = await app.prisma.home.findMany({
      where: {
        members: {
          some: {
            userId: req.user.userId,
          },
        },
      },
      include: {
        members: {
          include: {
            user: true,
          },
        },
      },
    })
    return homes
  })

  app.post('/homes', {
    preHandler: [app.authenticate],
  }, async (req) => {
    const { name } = req.body as { name: string }

    const home = await app.prisma.home.create({
      data: {
        name,
        members: {
          create: {
            userId: req.user.userId,
            role: 'ADMIN',
          },
        },
      },
    })
    return home
  })

  app.get('/homes/:id', {
    preHandler: [app.authenticate],
  }, async (req, res) => {
    const { id } = req.params as { id: string }

    const home = await app.prisma.home.findUnique({
      where: { id },
      include: {
        members: {
          include: {
            user: true,
          },
        },
      },
    })

    if (!home) {
      return res.status(404).send({ error: 'Home not found' })
    }

    const isMember = home.members.some(m => m.userId === req.user.userId)
    if (!isMember) {
      return res.status(403).send({ error: 'Access denied' })
    }

    return home
  })

  app.put('/homes/:id', {
    preHandler: [app.authenticate],
  }, async (req, res) => {
    const { id } = req.params as { id: string }
    const { name } = req.body as { name: string }

    const member = await app.prisma.homeMember.findUnique({
      where: {
        userId_homeId: {
          userId: req.user.userId,
          homeId: id,
        },
      },
    })

    if (!member) {
      return res.status(403).send({ error: 'Access denied' })
    }

    if (member.role !== 'ADMIN') {
      return res.status(403).send({ error: 'Only admins can update a home' })
    }

    const home = await app.prisma.home.update({
      where: { id },
      data: { name },
    })
    return home
  })

  app.delete('/homes/:id', {
    preHandler: [app.authenticate],
  }, async (req, res) => {
    const { id } = req.params as { id: string }

    const member = await app.prisma.homeMember.findUnique({
      where: {
        userId_homeId: {
          userId: req.user.userId,
          homeId: id,
        },
      },
    })

    if (!member) {
      return res.status(403).send({ error: 'Access denied' })
    }

    if (member.role !== 'ADMIN') {
      return res.status(403).send({ error: 'Only admins can delete a home' })
    }

    await app.prisma.home.delete({ where: { id } })
    return { deleted: true }
  })
}