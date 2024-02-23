import Route from '@ioc:Adonis/Core/Route';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import AttributesController from 'App/Controllers/Http/product/AttributesController';

Route.group(async () => {
  Route.post('/', (ctx: HttpContextContract) => {
    return new AttributesController().create(ctx);
  });
  Route.put('/:id', (ctx: HttpContextContract) => {
    return new AttributesController().update(ctx);
  });
  Route.delete('/:id', (ctx: HttpContextContract) => {
    return new AttributesController().destroy(ctx);
  });

  Route.get('/', (ctx: HttpContextContract) => {
    return new AttributesController().findAllRecords(ctx);
  });
  Route.get('/:id', (ctx: HttpContextContract) => {
    return new AttributesController().findSingleRecord(ctx);
  });
})
  .middleware(['auth:api'])
  .prefix('/api/v1/attributes');
