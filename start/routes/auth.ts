import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
const AuthController = () => import('#controllers/auth_controller')

router
  .group(() => {
    router.post('/login', [AuthController, 'login'])
    router.post('/register', [AuthController, 'register'])
    router
      .group(() => {
        router.get('/logout', [AuthController, 'logout'])
        router.get('/authenticated', [AuthController, 'authenticated'])
      })
      .use(middleware.auth({ guards: ['api'] }))
  })
  .use(middleware.tenant())
  .prefix('/api/v1/auth')
