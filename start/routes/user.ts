import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
const UserController = () => import('#controllers/user_controller')

router
  .group(() => {
    router.get('/', [UserController, 'index'])
    router.post('/', [UserController, 'create'])
    router.get('/:id', [UserController, 'show'])
    router.put('/:id', [UserController, 'update'])
    router.put('/assign-permission/:id', [UserController, 'assignPermission'])
    router.put('/status/:id', [UserController, 'updateStatus'])
    router.put('/profile/:id', [UserController, 'profileUpdate'])
    router.delete('/:id', [UserController, 'destroy'])
  })
  .use([middleware.auth({ guards: ['api'] }), middleware.tenant()])
  .prefix('/api/v1/users')
