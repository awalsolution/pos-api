import Route from '@ioc:Adonis/Core/Route';
// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
// import MenuController from 'App/Controllers/Http/MenuController';

Route.group(async () => {
  Route.post('/', 'MenuController.create');
  Route.put('/:id', 'MenuController.update');
  Route.delete('/:id', 'MenuController.destroy');
  Route.get('/', 'MenuController.findAllRecords');
  Route.get('/:id', 'MenuController.findSingleRecord');
})
  .middleware(['auth:api'])
  .prefix('/api/v1/menu');
