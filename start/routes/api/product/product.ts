import Route from '@ioc:Adonis/Core/Route';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ProductsController from 'App/Controllers/Http/product/ProductsController';

Route.group(async () => {
  Route.post('/', (ctx: HttpContextContract) => {
    return new ProductsController().create(ctx);
  });
  Route.put('/:id', (ctx: HttpContextContract) => {
    return new ProductsController().update(ctx);
  });
  Route.delete('/:id', (ctx: HttpContextContract) => {
    return new ProductsController().destroy(ctx);
  });
  Route.get('/', (ctx: HttpContextContract) => {
    return new ProductsController().findAllRecords(ctx);
  });
  Route.get('/:id', (ctx: HttpContextContract) => {
    return new ProductsController().findSingleRecord(ctx);
  });
})
  .middleware(['auth:api'])
  .prefix('/api/v1/products');
