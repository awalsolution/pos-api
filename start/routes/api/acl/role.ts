import Route from '@ioc:Adonis/Core/Route';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import RoleController from 'App/Controllers/Http/Acl/RoleController';

Route.group(async () => {
  Route.post('/', (ctx: HttpContextContract) => {
    return new RoleController().create(ctx);
  });
  Route.put('/:id', (ctx: HttpContextContract) => {
    return new RoleController().update(ctx);
  });
  Route.put('/assign-permission/:id', (ctx: HttpContextContract) => {
    return new RoleController().assignPermission(ctx);
  });
  Route.delete('/:id', (ctx: HttpContextContract) => {
    return new RoleController().destroy(ctx);
  });
  Route.get('/', (ctx: HttpContextContract) => {
    return new RoleController().findAllRecords(ctx);
  });

  Route.get('/:id', (ctx: HttpContextContract) => {
    return new RoleController().findSingleRecord(ctx);
  });
})
  .middleware(['auth:api'])
  .prefix('/api/v1/role');
