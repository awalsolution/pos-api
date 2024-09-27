import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
const CustomersController = () => import('#controllers/tenant/customer_controller')

router
  .group(() => {
    router.get('/', [CustomersController, 'index'])
    router.post('/', [CustomersController, 'create'])
    router.get('/:id', [CustomersController, 'show'])
    router.put('/:id', [CustomersController, 'update'])
    router.delete('/:id', [CustomersController, 'destroy'])
  })
  .use([middleware.auth({ guards: ['api'] }), middleware.tenant()])
  .prefix('/api/v1/customers')
