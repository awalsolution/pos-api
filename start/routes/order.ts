import Route from '@ioc:Adonis/Core/Route';

Route.group(async () => {
  Route.get('/', 'OrderController.findAllRecords');
  Route.post('/', 'OrderController.create');
  Route.get('/:id', 'OrderController.findSingleRecord');
  Route.put('/:id', 'OrderController.update');
  Route.delete('/:id', 'OrderController.destroy');
})
  .middleware(['auth:api'])
  .prefix('/api/v1/order');
