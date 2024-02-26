import Route from '@ioc:Adonis/Core/Route';

Route.group(async () => {
  Route.get('/', 'VariantController.findAllRecords');
  Route.get('/:id', 'VariantController.findSingleRecord');
  Route.get('/findBy/:id', 'VariantController.getVariantsByProduct');
  Route.group(() => {
    Route.post('/:id', 'VariantController.create');
    Route.put('/:id', 'VariantController.update');
    Route.delete('/:id', 'VariantController.destroy');
  }).middleware(['auth:api']);
}).prefix('/api/v1/variant');
