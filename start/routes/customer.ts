import Route from '@ioc:Adonis/Core/Route';

Route.group(async () => {
  Route.post('/register', 'CustomerController.create');
  Route.post('/login', 'CustomerController.login');
  Route.group(() => {
    Route.get('/', 'CustomerController.findAllRecords');
    Route.post('/', 'CustomerController.create');
    Route.delete('/:id', 'CustomerController.destroy');
  }).middleware(['auth:api']);
  Route.group(() => {
    Route.get('/authenticated', 'CustomerController.authenticated');
    Route.get('/:id', 'CustomerController.findSingleRecord');
    Route.put('/:id', 'CustomerController.update');
    Route.put('/profile/:id', 'CustomerController.profileUpdate');
  }).middleware(['auth:customer']);
}).prefix('/api/v1/customer');
