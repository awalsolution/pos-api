import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
const RoleController = () => import('#controllers/role_controller')

router
  .group(() => {
    router.get('/', [RoleController, 'index'])
    router.post('/', [RoleController, 'create'])
    router.get('/:id', [RoleController, 'show'])
    router.put('/:id', [RoleController, 'update'])
    router.put('/assign-permission/:id', [RoleController, 'assignPermission'])
    router.delete('/:id', [RoleController, 'destroy'])
  })
  .use([middleware.auth({ guards: ['api'] }), middleware.tenant()])
  .prefix('/api/v1/roles')
