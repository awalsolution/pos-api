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
import Application from '@ioc:Adonis/Core/Application';
import Drive from '@ioc:Adonis/Core/Drive';

Route.post('/api/v1/upload', async ({ request, response }) => {
  let image: any;

  if (request.file('categoriesImages')) {
    image = request.file('categoriesImages');
    await image.move(Application.tmpPath('uploads/categories'));
  } else if (request.file('productImages')) {
    image = request.file('productImages');
    await image.move(Application.tmpPath('uploads/products'));
  } else {
    image = request.file('images');
    await image.move(Application.tmpPath('uploads'));
  }

  const url = await Drive.getUrl(image?.fileName ? image.fileName : '');

  response.ok({
    code: 200,
    message: 'Image uploaded successfully.',
    data: url,
  });
});

Route.get('/', async () => {
  return "InSync CRM API's is Started.";
});

import './api/customer';
import './api/user';
import './api/shop';
import './api/product/product';
import './api/product/categories';
import './api/product/attribute';
import './api/auth';
import './api/acl/roles';
import './api/acl/permissions';
