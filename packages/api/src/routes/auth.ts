import { FastifyInstance } from 'fastify'

export default async function authRoutes(app: FastifyInstance) {
  app.get('/auth/google/callback', async (req, res) => {
    const token = await app.googleOauth2.getAccessTokenFromAuthorizationCodeFlow(req)

    const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${token.token.access_token}` },
    })
    const googleUser = await response.json() as { email: string; name: string }

    let user = await app.prisma.user.findUnique({
      where: { email: googleUser.email },
    })

    if (!user) {
      user = await app.prisma.user.create({
        data: {
          email: googleUser.email,
          fullName: googleUser.name,
        },
      })
    }

    const accessToken = app.jwt.sign({
      userId: user.id,
      email: user.email,
      fullName: user.fullName,
    })

    return res.send({
      success: true,
      token: accessToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      },
    })
  })

  app.post('/auth/refresh', {
    preHandler: [app.authenticate],
  }, async (req) => {
    const newToken = app.jwt.sign({
      userId: req.user.userId,
      email: req.user.email,
      fullName: req.user.fullName,
    })
    return { success: true, token: newToken }
  })
}