import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
const ShopController = () => import('#controllers/shop_controller')

router
  .group(() => {
    router.get('/', [ShopController, 'findAllRecords'])
    router.post('/', [ShopController, 'create'])
    router.get('/:id', [ShopController, 'findSingleRecord'])
    router.put('/:id', [ShopController, 'update'])
    router.put('/status/:id', [ShopController, 'updateStatus'])
    router.delete('/:id', [ShopController, 'destroy'])
  })
  .use(
    middleware.auth({
      guards: ['api'],
    })
  )
  .prefix('/api/v1/shop')
