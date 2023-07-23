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
  let image: any = '';
  let url: any = '';
  if (request.file('categories')) {
    image = request.file('categories');
    await image.move(Application.tmpPath('uploads/categories'));
    url = await Drive.getUrl(`/categories/${image.fileName}`);
  } else if (request.file('productImages')) {
    image = request.file('productImages');
    await image.move(Application.tmpPath('uploads/products'));
    url = await Drive.getUrl(`/products/${image.fileName}`);
  } else if (request.file('shop_images')) {
    image = request.file('shop_images');
    await image.move(Application.tmpPath('uploads/shop_logo'));
    url = await Drive.getUrl(`/shop_logo/${image.fileName}`);
  } else if (request.file('profile_image')) {
    image = request.file('profile_image');
    await image.move(Application.tmpPath('uploads/profile_pictures'));
    url = await Drive.getUrl(`/profile_pictures/${image.fileName}`);
  } else {
    image = request.file('images');
    await image.move(Application.tmpPath('uploads'));
    url = await Drive.getUrl(image.fileName);
  }

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
import './api/product/variant';
import './api/auth';
import './api/acl/roles';
import './api/acl/permissions';
