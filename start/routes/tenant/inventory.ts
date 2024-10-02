import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
const InventoriesController = () => import('#controllers/tenant/inventories_controller')

router
  .group(() => {
    router.get('/', [InventoriesController, 'index'])
    router.post('/', [InventoriesController, 'create'])
    router.get('/:id', [InventoriesController, 'show'])
    router.put('/:id', [InventoriesController, 'update'])
    router.delete('/:id', [InventoriesController, 'destroy'])
  })
  .use([middleware.auth({ guards: ['api'] }), middleware.tenant()])
  .prefix('/api/v1/inventories')
