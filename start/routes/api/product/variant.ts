import Route from '@ioc:Adonis/Core/Route';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import VariantsController from 'App/Controllers/Http/product/VariantsController';

Route.group(async () => {
  Route.post('/', (ctx: HttpContextContract) => {
    return new VariantsController().create(ctx);
  });
  Route.put('/:id', (ctx: HttpContextContract) => {
    return new VariantsController().update(ctx);
  });
  Route.delete('/:id', (ctx: HttpContextContract) => {
    return new VariantsController().destroy(ctx);
  });

  Route.get('/', (ctx: HttpContextContract) => {
    return new VariantsController().find(ctx);
  });
  Route.get('/:id', (ctx: HttpContextContract) => {
    return new VariantsController().get(ctx);
  });
})
  .middleware(['auth:api'])
  .prefix('/api/v1/variants');
