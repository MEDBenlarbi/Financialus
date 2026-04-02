import fastifyCookie from '@fastify/cookie'
import fastifyJwt from '@fastify/jwt'
import fastifyOauth2 from '@fastify/oauth2'
import { FastifyInstance } from 'fastify'
import fastifyPlugin from 'fastify-plugin'

export default fastifyPlugin(async (app: FastifyInstance) => {
  await app.register(fastifyCookie)

  await app.register(fastifyJwt, {
    secret: app.config.JWT_SECRET,
    sign: {
      expiresIn: '15m',
    },
  })

  await app.register(fastifyOauth2, {
    name: 'googleOauth2',
    credentials: {
      client: {
        id: app.config.GOOGLE_CLIENT_ID,
        secret: app.config.GOOGLE_CLIENT_SECRET,
      },
      auth: fastifyOauth2.GOOGLE_CONFIGURATION,
    },
    startRedirectPath: '/auth/google',
    callbackUri: `${app.config.PROTOCOL}://${app.config.HOST}:${app.config.PORT}/auth/google/callback`,
    scope: ['profile', 'email'],
  })

  app.decorate('authenticate', async (req: any, res: any) => {
    try {
      await req.jwtVerify()
    } catch (err) {
      res.status(401).send({ success: false, error: 'Unauthorized' })
    }
  })
})