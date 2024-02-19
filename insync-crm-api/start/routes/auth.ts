const AuthController = () => import('#controllers/auth_controller')
import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router.post('/register', [AuthController, 'register'])
    router.post('/login', [AuthController, 'login'])
    router.get('/logout', [AuthController, 'logout']).use(middleware.auth({ guards: ['api'] }))
    router
      .get('/authenticated', [AuthController, 'authenticated'])
      .use(middleware.auth({ guards: ['api'] }))
  })
  .prefix('/api/v1/auth')
