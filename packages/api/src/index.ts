import fastifyEnv from '@fastify/env'
import Fastify from 'fastify'
import { envSchema } from './config/env.schema.js'
import authPlugin from './plugins/auth.js'
import prismaPlugin from './plugins/prisma.js'
import authRoutes from './routes/auth.js'
import categoriesRoutes from './routes/categories.js'
import homesRoutes from './routes/homes.js'
import ledgersRoutes from './routes/ledgers.js'
import usersRoutes from './routes/users.js'

const app = Fastify({ logger: true })

const start = async () => {
  try {
    await app.register(fastifyEnv, { schema: envSchema })
    await app.register(prismaPlugin)
    await app.register(authPlugin)
    await app.register(authRoutes)
    await app.register(usersRoutes)
    await app.register(homesRoutes)
    await app.register(categoriesRoutes)
    await app.register(ledgersRoutes)

    app.get('/', async () => {
      return { status: 'Financialus API operational' }
    })

    await app.listen({
      port: app.config.PORT,
      host: app.config.HOST,
    })
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()