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

Route.post('/api/v1/upload', async ({ request, response }) => {
  const folders = ['categories', 'products', 'shops_logo', 'profile_picture'];

  let image: any = null;
  let url: string | null = null;

  for (const folder of folders) {
    if (request.file(folder)) {
      image = request.file(folder);
      await image.move(Application.tmpPath(`uploads/${folder}`));
      url = await Drive.getUrl(`/${folder}/${image.fileName}`);
      break;
    }
  }

  if (!url) {
    return response.badRequest({
      code: 400,
      message: 'Something went wrong! image not uploaded please try again!',
      data: null,
    });
  }

  response.ok({
    code: 200,
    message: 'Image uploaded successfully.',
    data: url,
  });
});

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
