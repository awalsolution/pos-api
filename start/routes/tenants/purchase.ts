import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
const PurchasesController = () => import('#controllers/tenants/purchases_controller')

router
  .group(() => {
    router.get('/', [PurchasesController, 'index'])
    router.post('/', [PurchasesController, 'create'])
    router.get('/:id', [PurchasesController, 'show'])
    router.put('/:id', [PurchasesController, 'update'])
    router.delete('/:id', [PurchasesController, 'destroy'])
  })
  .use([middleware.auth({ guards: ['api'] }), middleware.tenant()])
  .prefix('/api/v1/purchases')
