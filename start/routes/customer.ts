import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
const CustomerController = () => import('#controllers/customer_controller')

router
  .group(() => {
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
      .prefix('/client')

    router
      .group(() => {
        router.get('/:id', [CustomerController, 'findSingleRecord'])
        router.put('/:id', [CustomerController, 'update'])
        router.put('/profile/:id', [CustomerController, 'profileUpdate'])
      })
      .use(
        middleware.auth({
          guards: ['customer'],
        })
      )
      .prefix('/customer')
  })
  .prefix('/api/v1/')
