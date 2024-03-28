import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
const AuthController = () => import('#controllers/auth_controller')

router
  .group(() => {
    router
      .group(() => {
        router.post('/register', [AuthController, 'register'])
        router.post('/login', [AuthController, 'login'])
        router.post('/reset-password', [AuthController, 'resetPassword'])
        router
          .group(() => {
            router.get('/logout', [AuthController, 'logout'])
            router.get('/authenticated', [AuthController, 'authenticated'])
          })
          .use(middleware.auth({ guards: ['api'] }))
      })
      .prefix('/auth')

    // frontend
  })
  .prefix('/api/v1')
