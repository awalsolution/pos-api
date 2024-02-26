import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
const AttributeController = () => import('#controllers/attribute_controller')

router
  .group(() => {
    router.get('/', [AttributeController, 'findAllRecords'])
    router.get('/:id', [AttributeController, 'findSingleRecord'])
    router
      .group(() => {
        router.post('/', [AttributeController, 'create'])
        router.put('/:id', [AttributeController, 'update'])
        router.put('/status/:id', [AttributeController, 'updateStatus'])
        router.delete('/:id', [AttributeController, 'destroy'])
      })
      .use(
        middleware.auth({
          guards: ['api'],
        })
      )
  })
  .prefix('/api/v1/attribute')
