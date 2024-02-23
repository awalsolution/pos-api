import Route from '@ioc:Adonis/Core/Route';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import OrderController from 'App/Controllers/Http/OrderController';

Route.group(async () => {
  Route.post('/', (ctx: HttpContextContract) => {
    return new OrderController().create(ctx);
  });
  Route.put('/:id', (ctx: HttpContextContract) => {
    return new OrderController().update(ctx);
  });
  Route.delete('/:id', (ctx: HttpContextContract) => {
    return new OrderController().destroy(ctx);
  });

  Route.get('/', (ctx: HttpContextContract) => {
    return new OrderController().findAllRecords(ctx);
  });
  Route.get('/:id', (ctx: HttpContextContract) => {
    return new OrderController().findSingleRecord(ctx);
  });
})
  .middleware(['auth:api'])
  .prefix('/api/v1/order');
