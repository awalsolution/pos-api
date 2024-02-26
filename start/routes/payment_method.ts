import Route from '@ioc:Adonis/Core/Route';

Route.group(async () => {
  Route.get('/', 'PaymentMethodController.findAllRecords');
  Route.get('/:id', 'PaymentMethodController.findSingleRecord');
  Route.group(() => {
    Route.post('/', 'PaymentMethodController.create');
    Route.put('/:id', 'PaymentMethodController.update');
    Route.delete('/:id', 'PaymentMethodController.destroy');
  }).middleware(['auth:api']);
}).prefix('/api/v1/payment-method');
