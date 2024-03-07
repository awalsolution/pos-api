import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
const ProductController = () => import('#controllers/product_controller')

router
  .group(() => {
    router.get('/', [ProductController, 'findAllRecords'])
    router.get('/:product_id', [ProductController, 'findSingleRecord'])
    router.post('/', [ProductController, 'create'])
    router.put('/:id', [ProductController, 'update'])
    router.put('/status/:id', [ProductController, 'updateStatus'])
    router.delete('/:id', [ProductController, 'destroy'])
    router.post('/:product_id/attribute', [ProductController, 'storeAttribute'])
    router.get('/:product_id/attribute', [ProductController, 'findAttributeByProduct'])
    router.delete('/attribute/:id', [ProductController, 'destroyAttribute'])
    router.get('/:product_id/variant-generate', [ProductController, 'generateVariants'])
    router.get('/:product_id/variant', [ProductController, 'findSingleRecord'])
  })
  .use(
    middleware.auth({
      guards: ['api'],
    })
  )
  .prefix('/api/v1/product')
