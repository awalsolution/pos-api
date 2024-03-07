import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
const PaymentMethodController = () => import('#controllers/payment_method_controller')

router
  .group(() => {
    router.get('/', [PaymentMethodController, 'findAllRecords'])
    router.get('/:id', [PaymentMethodController, 'findSingleRecord'])
    router.post('/', [PaymentMethodController, 'create'])
    router.put('/:id', [PaymentMethodController, 'update'])
    router.put('/status/:id', [PaymentMethodController, 'updateStatus'])
    router.delete('/:id', [PaymentMethodController, 'destroy'])
  })
  .use(
    middleware.auth({
      guards: ['api'],
    })
  )
  .prefix('/api/v1/payment-method')
