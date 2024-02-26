import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
const CustomerController = () => import('#controllers/customer_controller')

router
  .group(() => {
    router
      .group(() => {
        router.get('/', [CustomerController, 'findAllRecords'])
        router.post('/', [CustomerController, 'create'])
        router.delete('/:id', [CustomerController, 'destroy'])
      })
      .use(
        middleware.auth({
          guards: ['api'],
        })
      )
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
  })
  .prefix('/api/v1/customer')
