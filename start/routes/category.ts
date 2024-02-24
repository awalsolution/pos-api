import Route from '@ioc:Adonis/Core/Route';

Route.group(async () => {
  Route.get('/', 'CategoryController.findAllRecords');
  Route.post('/', 'CategoryController.create');
  Route.get('/:id', 'CategoryController.findSingleRecord');
  Route.put('/:id', 'CategoryController.update');
  Route.delete('/:id', 'CategoryController.destroy');
})
  .middleware(['auth:api'])
  .prefix('/api/v1/category');
