import Route from '@ioc:Adonis/Core/Route';

Route.group(async () => {
  Route.get('/', 'PermissionController.findAllRecords');
  Route.post('/', 'PermissionController.create');
  Route.get('/:id', 'PermissionController.findSingleRecord');
  Route.put('/:id', 'PermissionController.update');
  Route.delete('/:id', 'PermissionController.destroy');
})
  .middleware(['auth:api'])
  .prefix('/api/v1/permission');
