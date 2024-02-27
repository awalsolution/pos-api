import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
const ProductController = () => import('#controllers/product_controller')

router
  .group(() => {
    router.get('/customer', [ProductController, 'findAllRecordsForFrontend'])
    router.get('/:product_id/variants', [ProductController, 'findSingleRecord'])
    router
      .group(() => {
        router.get('/', [ProductController, 'findAllRecords'])
        router.post('/', [ProductController, 'create'])
        router.put('/:id', [ProductController, 'update'])
        router.put('/status/:id', [ProductController, 'updateStatus'])
        router.delete('/:id', [ProductController, 'destroy'])
      })
      .use(
        middleware.auth({
          guards: ['api'],
        })
      )
  })
  .prefix('/api/v1/product')
