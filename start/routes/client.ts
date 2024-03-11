import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
const CustomerController = () => import('#controllers/customer_controller')

router
  .group(() => {
    router.get('/', [CustomerController, 'findAllRecords'])
    router.post('/', [CustomerController, 'create'])
    router.put('/status/:id', [CustomerController, 'updateStatus'])
    router.delete('/:id', [CustomerController, 'destroy'])
  })
  .use(
    middleware.auth({
      guards: ['api'],
    })
  )
  .prefix('/api/v1/client')
