/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route';

import AutoSwagger from 'adonis-autoswagger';
import swagger from 'Config/swagger';

Route.get('/swagger', async () => {
  return AutoSwagger.docs(Route.toJSON(), swagger);
});

Route.get('/docs', async () => {
  return AutoSwagger.ui('/swagger', swagger);
});

Route.get('/', async ({ response }) => {
  response.ok({
    code: 200,
    data: "InSync CRM API's is Started.",
  });
});

Route.post('/api/v1/upload', 'UploadController.imageUploader');

import './routes/auth';
import './routes/order';
import './routes/shipment_address';
import './routes/payment_method';
import './routes/product';
import './routes/category';
import './routes/attribute';
import './routes/variant';
import './routes/shop';
import './routes/user';
import './routes/role';
import './routes/permission';
import './routes/menu';
