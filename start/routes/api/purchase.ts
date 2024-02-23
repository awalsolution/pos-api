import Route from '@ioc:Adonis/Core/Route';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import PurchaseController from 'App/Controllers/Http/PurchaseController';

Route.group(async () => {
  Route.post('/', (ctx: HttpContextContract) => {
    return new PurchaseController().create(ctx);
  });
  Route.put('/:id', (ctx: HttpContextContract) => {
    return new PurchaseController().update(ctx);
  });
  Route.delete('/:id', (ctx: HttpContextContract) => {
    return new PurchaseController().destroy(ctx);
  });

  Route.get('/', (ctx: HttpContextContract) => {
    return new PurchaseController().findAllRecords(ctx);
  });
  Route.get('/:id', (ctx: HttpContextContract) => {
    return new PurchaseController().findSingleRecord(ctx);
  });
})
  .middleware(['auth:api'])
  .prefix('/api/v1/purchase');
