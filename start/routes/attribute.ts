import Route from '@ioc:Adonis/Core/Route';

Route.group(async () => {
  Route.get('/', 'AttributeController.findAllRecords');
  Route.post('/', 'AttributeController.create');
  Route.get('/:id', 'AttributeController.findSingleRecord');
  Route.put('/:id', 'AttributeController.update');
  Route.delete('/:id', 'AttributeController.destroy');
})
  .middleware(['auth:api'])
  .prefix('/api/v1/attribute');
