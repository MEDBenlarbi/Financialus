import { FastifyInstance } from 'fastify'

export default async function ledgersRoutes(app: FastifyInstance) {

  app.get('/ledgers', {
    preHandler: [app.authenticate],
  }, async (req) => {
    const query = req.query as {
      homeId?: string
      categoryId?: string
    }

    return await app.prisma.ledger.findMany({
      where: {
        userId: req.user.userId,
        ...(query.homeId && { homeId: query.homeId }),
        ...(query.categoryId && { categoryId: query.categoryId }),
      },
      include: {
        category: true,
        home: true,
      },
    })
  })

  app.post('/ledgers', {
    preHandler: [app.authenticate],
  }, async (req, res) => {
    const { name, description, amount, date, type, homeId, categoryId } = req.body as {
      name: string
      description?: string
      amount: number
      date: string
      type: string
      homeId: string
      categoryId: string
    }

    const member = await app.prisma.homeMember.findUnique({
      where: {
        userId_homeId: {
          userId: req.user.userId,
          homeId,
        },
      },
    })

    if (!member) {
      return res.status(403).send({ error: 'You are not a member of this home' })
    }

    return await app.prisma.ledger.create({
      data: {
        name,
        description,
        amount,
        date: new Date(date),
        type,
        status: 'APPROVED',
        userId: req.user.userId,
        homeId,
        categoryId,
      },
    })
  })

  app.get('/ledgers/:id', {
    preHandler: [app.authenticate],
  }, async (req, res) => {
    const { id } = req.params as { id: string }

    const ledger = await app.prisma.ledger.findUnique({
      where: { id },
      include: {
        category: true,
        home: true,
      },
    })

    if (!ledger) {
      return res.status(404).send({ error: 'Ledger not found' })
    }

    if (ledger.userId !== req.user.userId) {
      return res.status(403).send({ error: 'Access denied' })
    }

    return ledger
  })

  app.put('/ledgers/:id', {
    preHandler: [app.authenticate],
  }, async (req, res) => {
    const { id } = req.params as { id: string }
    const { name, description, amount, date, type, categoryId } = req.body as {
      name?: string
      description?: string
      amount?: number
      date?: string
      type?: string
      categoryId?: string
    }

    const ledger = await app.prisma.ledger.findUnique({
      where: { id },
    })

    if (!ledger) {
      return res.status(404).send({ error: 'Ledger not found' })
    }

    if (ledger.userId !== req.user.userId) {
      return res.status(403).send({ error: 'Access denied' })
    }

    return await app.prisma.ledger.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(amount && { amount }),
        ...(date && { date: new Date(date) }),
        ...(type && { type }),
        ...(categoryId && { categoryId }),
      },
    })
  })

  app.delete('/ledgers/:id', {
    preHandler: [app.authenticate],
  }, async (req, res) => {
    const { id } = req.params as { id: string }

    const ledger = await app.prisma.ledger.findUnique({
      where: { id },
    })

    if (!ledger) {
      return res.status(404).send({ error: 'Ledger not found' })
    }

    if (ledger.userId !== req.user.userId) {
      return res.status(403).send({ error: 'Access denied' })
    }

    await app.prisma.ledger.delete({ where: { id } })
    return { deleted: true }
  })
}