import Route from '@ioc:Adonis/Core/Route';

Route.group(async () => {
  Route.get('/', 'CategoryController.findAllRecords');
  Route.get('/:id', 'CategoryController.findSingleRecord');
  Route.group(() => {
    Route.post('/', 'CategoryController.create');
    Route.put('/:id', 'CategoryController.update');
    Route.delete('/:id', 'CategoryController.destroy');
  }).middleware(['auth:api']);
}).prefix('/api/v1/category');
