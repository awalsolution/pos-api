import Route from '@ioc:Adonis/Core/Route';

Route.group(async () => {
  Route.get('/', 'ProductController.findAllRecords');
  Route.post('/', 'ProductController.create');
  Route.get('/:id', 'ProductController.findSingleRecord');
  Route.put('/:id', 'ProductController.update');
  Route.delete('/:id', 'ProductController.destroy');
})
  .middleware(['auth:api'])
  .prefix('/api/v1/product');
