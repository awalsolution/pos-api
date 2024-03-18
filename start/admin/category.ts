import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
const CategoryController = () => import('#controllers/category_controller')

router
  .group(() => {
    router.get('/', [CategoryController, 'findAllRecords'])
    router.get('/:id', [CategoryController, 'findSingleRecord'])
    router.post('/', [CategoryController, 'create'])
    router.put('/:id', [CategoryController, 'update'])
    router.put('/status/:id', [CategoryController, 'updateStatus'])
    router.delete('/:id', [CategoryController, 'destroy'])
  })
  .use(
    middleware.auth({
      guards: ['api'],
    })
  )
  .prefix('/api/v1/category')
