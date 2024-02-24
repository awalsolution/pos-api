import Route from '@ioc:Adonis/Core/Route';

Route.group(async () => {
  Route.get('/', 'UserController.findAllRecords');
  Route.post('/', 'UserController.create');
  Route.get('/:id', 'UserController.findSingleRecord');
  Route.put('/:id', 'UserController.update');
  Route.put('/assign-permission/:id', 'UserController.assignPermission');
  Route.put('/profile/:id', 'UserController.profileUpdate');
  Route.delete('/:id', 'UserController.destroy');
})
  .middleware(['auth:api'])
  .prefix('/api/v1/user');
