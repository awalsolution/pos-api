import Route from '@ioc:Adonis/Core/Route';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import SupplierController from 'App/Controllers/Http/SupplierController';

Route.group(async () => {
  Route.post('/', (ctx: HttpContextContract) => {
    return new SupplierController().create(ctx);
  });
  Route.put('/:id', (ctx: HttpContextContract) => {
    return new SupplierController().update(ctx);
  });
  Route.delete('/:id', (ctx: HttpContextContract) => {
    return new SupplierController().destroy(ctx);
  });

  Route.get('/', (ctx: HttpContextContract) => {
    return new SupplierController().findAllRecords(ctx);
  });
  Route.get('/:id', (ctx: HttpContextContract) => {
    return new SupplierController().findSingleRecord(ctx);
  });
})
  .middleware(['auth:api'])
  .prefix('/api/v1/supplier');
