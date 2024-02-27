const AuthController = () => import('#controllers/auth_controller')
import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router
      .group(() => {
        router.post('/register', [AuthController, 'register'])
        router.post('/login', [AuthController, 'login'])
        router
          .group(() => {
            router.get('/logout', [AuthController, 'logout'])
            router.get('/authenticated', [AuthController, 'authenticated'])
          })
          .use(middleware.auth({ guards: ['api'] }))
      })
      .prefix('/auth')

    // frontend
    router
      .group(() => {
        router.post('/register', [AuthController, 'customerRegister'])
        router.post('/login', [AuthController, 'customerLogin'])
        router
          .group(() => {
            router.get('/logout', [AuthController, 'customerLogout'])
            router.get('/authenticated', [AuthController, 'customerAuthenticated'])
          })
          .use(middleware.auth({ guards: ['customer'] }))
      })
      .prefix('/customer')
  })
  .prefix('/api/v1')
