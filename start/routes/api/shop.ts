import Route from '@ioc:Adonis/Core/Route';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ShopController from 'App/Controllers/Http/ShopController';

Route.group(async () => {
  Route.post('/', (ctx: HttpContextContract) => {
    return new ShopController().create(ctx);
  });
  Route.put('/:id', (ctx: HttpContextContract) => {
    return new ShopController().update(ctx);
  });
  Route.delete('/:id', (ctx: HttpContextContract) => {
    return new ShopController().destroy(ctx);
  });

  Route.get('/', (ctx: HttpContextContract) => {
    return new ShopController().findAllRecords(ctx);
  });
  Route.get('/:id', (ctx: HttpContextContract) => {
    return new ShopController().findSingleRecord(ctx);
  });
})
  .middleware(['auth:api'])
  .prefix('/api/v1/shop');
