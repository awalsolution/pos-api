import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
const PaymentMethodController = () => import('#controllers/payment_method_controller')

router
  .group(() => {
    router.get('/', [PaymentMethodController, 'findAllRecords'])
    router.post('/', [PaymentMethodController, 'create'])
    router.get('/:id', [PaymentMethodController, 'findSingleRecord'])
    router.put('/:id', [PaymentMethodController, 'update'])
    router.delete('/:id', [PaymentMethodController, 'destroy'])
  })
  .use(
    middleware.auth({
      guards: ['api'],
    })
  )
  .prefix('/api/v1/payment-method')
