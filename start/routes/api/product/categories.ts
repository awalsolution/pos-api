import Route from '@ioc:Adonis/Core/Route';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import CategoriesController from 'App/Controllers/Http/product/CategoriesController';

Route.group(async () => {
  Route.post('/', (ctx: HttpContextContract) => {
    return new CategoriesController().create(ctx);
  });
  Route.put('/:id', (ctx: HttpContextContract) => {
    return new CategoriesController().update(ctx);
  });
  Route.delete('/:id', (ctx: HttpContextContract) => {
    return new CategoriesController().destroy(ctx);
  });

  Route.get('/', (ctx: HttpContextContract) => {
    return new CategoriesController().findAllRecords(ctx);
  });
  Route.get('/:id', (ctx: HttpContextContract) => {
    return new CategoriesController().findSingleRecord(ctx);
  });
})
  .middleware(['auth:api'])
  .prefix('/api/v1/categories');
