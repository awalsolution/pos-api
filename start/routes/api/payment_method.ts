import Route from '@ioc:Adonis/Core/Route';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import PaymentMethodController from 'App/Controllers/Http/PaymentMethodController';

Route.group(async () => {
  Route.post('/', (ctx: HttpContextContract) => {
    return new PaymentMethodController().create(ctx);
  });
  Route.put('/:id', (ctx: HttpContextContract) => {
    return new PaymentMethodController().update(ctx);
  });
  Route.delete('/:id', (ctx: HttpContextContract) => {
    return new PaymentMethodController().destroy(ctx);
  });

  Route.get('/', (ctx: HttpContextContract) => {
    return new PaymentMethodController().findAllRecords(ctx);
  });
  Route.get('/:id', (ctx: HttpContextContract) => {
    return new PaymentMethodController().findSingleRecord(ctx);
  });
})
  .middleware(['auth:api'])
  .prefix('/api/v1/payment-method');
