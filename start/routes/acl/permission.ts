import Route from '@ioc:Adonis/Core/Route';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import PermissionController from 'App/Controllers/Http/Acl/PermissionController';

Route.group(async () => {
  Route.post('/', (ctx: HttpContextContract) => {
    return new PermissionController().create(ctx);
  });
  Route.put('/:id', (ctx: HttpContextContract) => {
    return new PermissionController().update(ctx);
  });
  Route.delete('/:id', (ctx: HttpContextContract) => {
    return new PermissionController().destroy(ctx);
  });
  Route.get('/', (ctx: HttpContextContract) => {
    return new PermissionController().findAllRecords(ctx);
  });
  Route.get('/:id', (ctx: HttpContextContract) => {
    return new PermissionController().findSingleRecord(ctx);
  });
})
  .middleware(['auth:api'])
  .prefix('/api/v1/permission');
