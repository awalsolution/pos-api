import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
const ClientController = () => import('#controllers/client_controller')

router
  .group(() => {
    router.get('/', [ClientController, 'findAllRecords'])
    router.post('/', [ClientController, 'create'])
    router.put('/status/:id', [ClientController, 'updateStatus'])
    router.delete('/:id', [ClientController, 'destroy'])
  })
  .use(
    middleware.auth({
      guards: ['api'],
    })
  )
  .prefix('/api/v1/client')
