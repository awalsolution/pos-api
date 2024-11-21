import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
const ProductsCategoriesController = () =>
  import('#controllers/tenant/product_categories_controller')

router
  .group(() => {
    router.get('/', [ProductsCategoriesController, 'index'])
    router.post('/', [ProductsCategoriesController, 'create'])
    router.get('/:id', [ProductsCategoriesController, 'show'])
    router.put('/:id', [ProductsCategoriesController, 'update'])
    router.delete('/:id', [ProductsCategoriesController, 'destroy'])
  })
  .use([middleware.auth({ guards: ['api'] }), middleware.tenant()])
  .prefix('/api/v1/product-categories')
