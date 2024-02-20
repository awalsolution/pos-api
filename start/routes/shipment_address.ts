import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
const ShipmentAddressController = () => import('#controllers/shipment_address_controller')

router
  .group(() => {
    router.get('/', [ShipmentAddressController, 'findAllRecords'])
    router.post('/', [ShipmentAddressController, 'create'])
    router.get('/:id', [ShipmentAddressController, 'findSingleRecord'])
    router.put('/:id', [ShipmentAddressController, 'update'])
    router.delete('/:id', [ShipmentAddressController, 'destroy'])
  })
  .use(
    middleware.auth({
      guards: ['api'],
    })
  )
  .prefix('/api/v1/shipment-address')
