import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
const PermissionController = () => import('#controllers/permission_controller')

router
  .group(() => {
    router.get('/', [PermissionController, 'index'])
    router.post('/', [PermissionController, 'create'])
    router.get('/:id', [PermissionController, 'show'])
    router.put('/:id', [PermissionController, 'update'])
    router.delete('/:id', [PermissionController, 'destroy'])
  })
  .use([middleware.auth({ guards: ['api'] }), middleware.tenant()])
  .prefix('/api/v1/permissions')
