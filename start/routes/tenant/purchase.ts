import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
const PurchasesController = () => import('#controllers/tenant/purchases_controller')
const PurchasesItemsController = () => import('#controllers/tenant/purchase_items_controller')

router
  .group(() => {
    router.get('/', [PurchasesController, 'index'])
    router.post('/', [PurchasesController, 'create'])
    router.get('/:id', [PurchasesController, 'show'])
    router.put('/:id', [PurchasesController, 'update'])
    router.delete('/:id', [PurchasesController, 'destroy'])
    router.put('/status/:id', [PurchasesController, 'updateStatus'])
  })
  .use([middleware.auth({ guards: ['api'] }), middleware.tenant()])
  .prefix('/api/v1/purchases')

router
  .group(() => {
    router.get('/list/:id', [PurchasesItemsController, 'index'])
    router.post('/:id', [PurchasesItemsController, 'create'])
    router.delete('/:id', [PurchasesItemsController, 'destroy'])
  })
  .use([middleware.auth({ guards: ['api'] }), middleware.tenant()])
  .prefix('/api/v1/purchases/items')
