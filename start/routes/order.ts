import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
const OrderController = () => import('#controllers/order_controller')

router
  .group(() => {
    router.get('/', [OrderController, 'findAllRecords'])
    router.post('/', [OrderController, 'create'])
    router.get('/:id', [OrderController, 'findSingleRecord'])
    router.put('/:id', [OrderController, 'update'])
    router.put('/status/:id', [OrderController, 'updateStatus'])
    router.delete('/:id', [OrderController, 'destroy'])
  })
  .use(
    middleware.auth({
      guards: ['api'],
    })
  )
  .prefix('/api/v1/order')
