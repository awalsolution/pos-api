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
  let images: any = '';
  let url: any = '';
  // let urls: any = [];
  if (request.file('categories')) {
    images = request.file('categories');
    await images.move(Application.tmpPath('uploads/categories'));
    url = await Drive.getUrl(`/categories/${images.fileName}`);
  } else if (request.files('productImages')) {
    images = request.file('productImages');
    await images.move(Application.tmpPath('uploads/products'));
    url = await Drive.getUrl(`/products/${images.fileName}`);
    // for (let image of images) {
    //   // urls.push(url);
    // }
  } else if (request.file('shop_images')) {
    images = request.file('shop_images');
    await images.move(Application.tmpPath('uploads/shop_logo'));
    url = await Drive.getUrl(`/shop_logo/${images.fileName}`);
  } else if (request.file('profile_image')) {
    images = request.file('profile_image');
    await images.move(Application.tmpPath('uploads/profile_pictures'));
    url = await Drive.getUrl(`/profile_pictures/${images.fileName}`);
  } else {
    images = request.file('images');
    await images.move(Application.tmpPath('uploads'));
    url = await Drive.getUrl(images.fileName);
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
