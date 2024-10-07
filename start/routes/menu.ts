import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
const MenuController = () => import('#controllers/menu_controller')

router
  .group(() => {
    router.get('/', [MenuController, 'index'])
    router.post('/', [MenuController, 'create'])
    router.get('/:id', [MenuController, 'show'])
    router.put('/:id', [MenuController, 'update'])
    router.delete('/:id', [MenuController, 'destroy'])
  })
  .use([middleware.auth({ guards: ['api'] }), middleware.tenant()])
  .prefix('/api/v1/menus')
