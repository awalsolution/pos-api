import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
// const AttributeController = () => import('#controllers/attribute_controller')
const ProductController = () => import('#controllers/product_controller')

router
  .group(() => {
    router.get('/', [ProductController, 'index'])
    router.post('/', [ProductController, 'create'])
    router.get('/:product_id', [ProductController, 'show'])
    router.put('/:product_id', [ProductController, 'update'])
    router.delete('/:product_id', [ProductController, 'destroy'])
    router.put('/:product_id/status', [ProductController, 'updateStatus'])
    // attribute
    // router.get('/:product_id/attribute', [AttributeController, 'index'])
    // router.post('/:product_id/attribute', [AttributeController, 'create'])
    // router.get('/attribute/:attribute_id', [AttributeController, 'show'])
    // router.put('/attribute/:attribute_id', [AttributeController, 'update'])
    // router.delete('/attribute/:attribute_id', [AttributeController, 'destroy'])
    //
    // router.get('/:product_id/variant-generate', [ProductController, 'generateVariants'])
    // router.get('/:product_id/variant', [ProductController, 'findSingleRecord'])
  })
  .use(
    middleware.auth({
      guards: ['api'],
    })
  )
  .prefix('/api/v1/product')
