import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
const SupplierController = () => import('#controllers/tenant/suppliers_controller')

router
  .group(() => {
    router.get('/', [SupplierController, 'index'])
    router.post('/', [SupplierController, 'create'])
    router.get('/:id', [SupplierController, 'show'])
    router.put('/:id', [SupplierController, 'update'])
    router.delete('/:id', [SupplierController, 'destroy'])
  })
  .use([middleware.auth({ guards: ['api'] }), middleware.tenant()])
  .prefix('/api/v1/suppliers')
