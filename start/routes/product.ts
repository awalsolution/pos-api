import Route from '@ioc:Adonis/Core/Route';

Route.group(async () => {
  Route.get('/', 'ProductController.findAllRecords');
  Route.get('/:id', 'ProductController.findSingleRecord');
  Route.group(() => {
    Route.post('/', 'ProductController.create');
    Route.put('/:id', 'ProductController.update');
    Route.delete('/:id', 'ProductController.destroy');
  }).middleware(['auth:api']);
}).prefix('/api/v1/product');
