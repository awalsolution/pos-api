import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
const InventoryCategoriesController = () =>
  import('#controllers/tenant/inventory_categories_controller')

router
  .group(() => {
    router.get('/', [InventoryCategoriesController, 'index'])
    router.post('/', [InventoryCategoriesController, 'create'])
    router.get('/:id', [InventoryCategoriesController, 'show'])
    router.put('/:id', [InventoryCategoriesController, 'update'])
    router.delete('/:id', [InventoryCategoriesController, 'destroy'])
  })
  .use([middleware.auth({ guards: ['api'] }), middleware.tenant()])
  .prefix('/api/v1/product-categories')
