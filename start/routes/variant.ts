import Route from '@ioc:Adonis/Core/Route';

Route.group(async () => {
  Route.get('/', 'VariantController.findAllRecords');
  Route.post('/:id', 'VariantController.create');
  Route.get('/:id', 'VariantController.findSingleRecord');
  Route.put('/:id', 'VariantController.update');
  Route.delete('/:id', 'VariantController.destroy');
  Route.get('/findBy/:id', 'VariantController.getVariantsByProduct');
})
  .middleware(['auth:api'])
  .prefix('/api/v1/variant');
