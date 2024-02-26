import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
const AttributeController = () => import('#controllers/attribute_controller')

router
  .group(() => {
    router.get('/', [AttributeController, 'findAllRecords'])
    router.post('/', [AttributeController, 'create'])
    router.get('/:id', [AttributeController, 'findSingleRecord'])
    router.put('/:id', [AttributeController, 'update'])
    router.delete('/:id', [AttributeController, 'destroy'])
  })
  .use(
    middleware.auth({
      guards: ['api'],
    })
  )
  .prefix('/api/v1/attribute')
