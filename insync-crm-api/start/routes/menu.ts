import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
const MenuController = () => import('#controllers/menu_controller')

router
  .group(() => {
    router.get('/', [MenuController, 'findAllRecords'])
    router.post('/', [MenuController, 'create'])
    router.get('/:id', [MenuController, 'findSingleRecord'])
    router.put('/:id', [MenuController, 'update'])
    router.delete('/:id', [MenuController, 'destroy'])
  })
  .use(
    middleware.auth({
      guards: ['api'],
    })
  )
  .prefix('/api/v1/menu')
