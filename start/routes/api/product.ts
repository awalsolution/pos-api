import Route from '@ioc:Adonis/Core/Route';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import ProductsController from 'App/Controllers/Http/ProductsController';

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
    return new ProductsController().find(ctx);
  });
  Route.get('/:id', (ctx: HttpContextContract) => {
    return new ProductsController().get(ctx);
  });
  Route.put('/status/:id', (ctx: HttpContextContract) => {
    return new ProductsController().updateProductStatus(ctx);
  });
})
  .middleware(['auth:api'])
  .prefix('/api/v1/products');
