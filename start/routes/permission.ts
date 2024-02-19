import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
const PermissionController = () => import('#controllers/permission_controller')

router
  .group(() => {
    router.get('/', [PermissionController, 'findAllRecords'])
    router.post('/', [PermissionController, 'create'])
    router.get('/:id', [PermissionController, 'findSingleRecord'])
    router.put('/:id', [PermissionController, 'update'])
    router.delete('/:id', [PermissionController, 'destroy'])
  })
  .use(
    middleware.auth({
      guards: ['api'],
    })
  )
  .prefix('/api/v1/permission')
