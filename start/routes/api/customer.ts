import Route from '@ioc:Adonis/Core/Route';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import CustomersController from 'App/Controllers/Http/CustomersController';

Route.group(async () => {
  Route.post('/', (ctx: HttpContextContract) => {
    return new CustomersController().create(ctx);
  });
  Route.put('/:id', (ctx: HttpContextContract) => {
    return new CustomersController().update(ctx);
  });
  Route.delete('/:id', (ctx: HttpContextContract) => {
    return new CustomersController().destroy(ctx);
  });

  Route.get('/', (ctx: HttpContextContract) => {
    return new CustomersController().find(ctx);
  });
  Route.get('/:id', (ctx: HttpContextContract) => {
    return new CustomersController().get(ctx);
  });
  Route.put('/status/:id', (ctx: HttpContextContract) => {
    return new CustomersController().updateCustomerStatus(ctx);
  });
})
  .middleware(['auth:api'])
  .prefix('/api/v1/customers');