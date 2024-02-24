import Route from '@ioc:Adonis/Core/Route';

Route.group(async () => {
  Route.get('/', 'ShipmentAddressController.findAllRecords');
  Route.post('/', 'ShipmentAddressController.create');
  Route.get('/:id', 'ShipmentAddressController.findSingleRecord');
  Route.put('/:id', 'ShipmentAddressController.update');
  Route.delete('/:id', 'ShipmentAddressController.destroy');
})
  .middleware(['auth:api'])
  .prefix('/api/v1/shipment-address');
