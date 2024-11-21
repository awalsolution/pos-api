import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
const ProductsController = () => import('#controllers/tenant/products_controller')

router
  .group(() => {
    router.get('/', [ProductsController, 'index'])
    router.post('/', [ProductsController, 'create'])
    router.get('/:id', [ProductsController, 'show'])
    router.put('/:id', [ProductsController, 'update'])
    router.delete('/:id', [ProductsController, 'destroy'])
  })
  .use([middleware.auth({ guards: ['api'] }), middleware.tenant()])
  .prefix('/api/v1/products')
