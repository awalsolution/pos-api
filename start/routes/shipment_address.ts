import Route from '@ioc:Adonis/Core/Route';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ShipmentAddressController from 'App/Controllers/Http/ShipmentAddressController';

Route.group(async () => {
  Route.post('/', (ctx: HttpContextContract) => {
    return new ShipmentAddressController().create(ctx);
  });
  Route.put('/:id', (ctx: HttpContextContract) => {
    return new ShipmentAddressController().update(ctx);
  });
  Route.delete('/:id', (ctx: HttpContextContract) => {
    return new ShipmentAddressController().destroy(ctx);
  });

  Route.get('/', (ctx: HttpContextContract) => {
    return new ShipmentAddressController().findAllRecords(ctx);
  });
  Route.get('/:id', (ctx: HttpContextContract) => {
    return new ShipmentAddressController().findSingleRecord(ctx);
  });
})
  .middleware(['auth:api'])
  .prefix('/api/v1/shipment-address');
