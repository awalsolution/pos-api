import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
const ProductController = () => import('#controllers/product_controller')

router
  .group(() => {
    router.get('/', [ProductController, 'findAllRecords'])
    router.post('/', [ProductController, 'create'])
    router.get('/:id', [ProductController, 'findSingleRecord'])
    router.put('/:id', [ProductController, 'update'])
    router.delete('/:id', [ProductController, 'destroy'])
  })
  .use(
    middleware.auth({
      guards: ['api'],
    })
  )
  .prefix('/api/v1/product')
