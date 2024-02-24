import Route from '@ioc:Adonis/Core/Route';

Route.group(async () => {
  Route.get('/', 'RoleController.findAllRecords');
  Route.post('/', 'RoleController.create');
  Route.get('/:id', 'RoleController.findSingleRecord');
  Route.put('/:id', 'RoleController.update');
  Route.put('/assign-permission/:id', 'RoleController.assignPermission');
  Route.delete('/:id', 'RoleController.destroy');
})
  .middleware(['auth:api'])
  .prefix('/api/v1/role');
