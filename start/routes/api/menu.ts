import Route from '@ioc:Adonis/Core/Route';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import MenuController from 'App/Controllers/Http/MenuController';

Route.group(async () => {
  Route.post('/', (ctx: HttpContextContract) => {
    return new MenuController().create(ctx);
  });
  Route.put('/:id', (ctx: HttpContextContract) => {
    return new MenuController().update(ctx);
  });
  Route.delete('/:id', (ctx: HttpContextContract) => {
    return new MenuController().destroy(ctx);
  });

  Route.get('/', (ctx: HttpContextContract) => {
    return new MenuController().findAllRecords(ctx);
  });

  Route.get('/:id', (ctx: HttpContextContract) => {
    return new MenuController().findSingleRecord(ctx);
  });
})
  .middleware(['auth:api'])
  .prefix('/api/v1/menu');
