import Route from '@ioc:Adonis/Core/Route';

Route.group(async () => {
  Route.get('/', 'MenuController.findAllRecords');
  Route.post('/', 'MenuController.create');
  Route.get('/:id', 'MenuController.findSingleRecord');
  Route.put('/:id', 'MenuController.update');
  Route.delete('/:id', 'MenuController.destroy');
})
  .middleware(['auth:api'])
  .prefix('/api/v1/menu');
