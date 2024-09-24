import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
const VendorController = () => import('#controllers/tenant/vendor_controller')

router
  .group(() => {
    router.get('/', [VendorController, 'index'])
    router.post('/', [VendorController, 'create'])
    router.get('/:id', [VendorController, 'show'])
    router.put('/:id', [VendorController, 'update'])
    router.delete('/:id', [VendorController, 'destroy'])
  })
  .use([middleware.auth({ guards: ['api'] }), middleware.tenant()])
  .prefix('/api/v1/vendors')
