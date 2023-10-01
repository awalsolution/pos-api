import Route from '@ioc:Adonis/Core/Route';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import MerchantController from 'App/Controllers/Http/MerchantController';

Route.group(async () => {
  Route.post('/', (ctx: HttpContextContract) => {
    return new MerchantController().create(ctx);
  });
  Route.put('/:id', (ctx: HttpContextContract) => {
    return new MerchantController().update(ctx);
  });
  Route.delete('/:id', (ctx: HttpContextContract) => {
    return new MerchantController().destroy(ctx);
  });

  Route.get('/', (ctx: HttpContextContract) => {
    return new MerchantController().findAllRecords(ctx);
  });
  Route.get('/:id', (ctx: HttpContextContract) => {
    return new MerchantController().findSingleRecord(ctx);
  });
})
  .middleware(['auth:api'])
  .prefix('/api/v1/purchase');
