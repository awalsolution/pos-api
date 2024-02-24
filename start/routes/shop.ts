import Route from '@ioc:Adonis/Core/Route';

Route.group(async () => {
  Route.get('/', 'ShopController.findAllRecords');
  Route.post('/', 'ShopController.create');
  Route.get('/:id', 'ShopController.findSingleRecord');
  Route.put('/:id', 'ShopController.update');
  Route.delete('/:id', 'ShopController.destroy');
})
  .middleware(['auth:api'])
  .prefix('/api/v1/shop');
