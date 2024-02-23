import Route from '@ioc:Adonis/Core/Route';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import WarehouseController from 'App/Controllers/Http/WarehouseController';

Route.group(async () => {
  Route.post('/', (ctx: HttpContextContract) => {
    return new WarehouseController().create(ctx);
  });
  Route.put('/:id', (ctx: HttpContextContract) => {
    return new WarehouseController().update(ctx);
  });
  Route.delete('/:id', (ctx: HttpContextContract) => {
    return new WarehouseController().destroy(ctx);
  });

  Route.get('/', (ctx: HttpContextContract) => {
    return new WarehouseController().findAllRecords(ctx);
  });
  Route.get('/:id', (ctx: HttpContextContract) => {
    return new WarehouseController().findSingleRecord(ctx);
  });
})
  .middleware(['auth:api'])
  .prefix('/api/v1/warehouse');
