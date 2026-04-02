import { FastifyInstance } from 'fastify'

export default async function categoriesRoutes(app: FastifyInstance) {

  app.get('/categories', {
    preHandler: [app.authenticate],
  }, async () => {
    return await app.prisma.category.findMany()
  })

  app.post('/categories', {
    preHandler: [app.authenticate],
  }, async (req) => {
    const { name, description } = req.body as {
      name: string
      description?: string
    }

    return await app.prisma.category.create({
      data: { name, description },
    })
  })

  app.get('/categories/:id', {
    preHandler: [app.authenticate],
  }, async (req, res) => {
    const { id } = req.params as { id: string }

    const category = await app.prisma.category.findUnique({
      where: { id },
    })

    if (!category) {
      return res.status(404).send({ error: 'Category not found' })
    }

    return category
  })

  app.put('/categories/:id', {
    preHandler: [app.authenticate],
  }, async (req, res) => {
    const { id } = req.params as { id: string }
    const { name, description } = req.body as {
      name?: string
      description?: string
    }

    const exists = await app.prisma.category.findUnique({
      where: { id },
    })

    if (!exists) {
      return res.status(404).send({ error: 'Category not found' })
    }

    return await app.prisma.category.update({
      where: { id },
      data: { name, description },
    })
  })

  app.delete('/categories/:id', {
    preHandler: [app.authenticate],
  }, async (req, res) => {
    const { id } = req.params as { id: string }

    const exists = await app.prisma.category.findUnique({
      where: { id },
    })

    if (!exists) {
      return res.status(404).send({ error: 'Category not found' })
    }

    await app.prisma.category.delete({ where: { id } })
    return { deleted: true }
  })
}