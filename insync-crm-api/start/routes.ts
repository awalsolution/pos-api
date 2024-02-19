/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

// import { HttpContext } from '@adonisjs/core/http'
import router from '@adonisjs/core/services/router'
// import app from '@adonisjs/core/services/app'

router.get('/', async () => {
  return "InSync CRM API's is Started."
})

import AutoSwagger from 'adonis-autoswagger'
import swagger from '#config/swagger'

// router.post('/api/v1/upload', async ({ request, response }: HttpContext) => {
//   let image: any = ''
//   let url: any = ''
//   if (request.file('categories')) {
//     image = request.file('categories')
//     await image.move(app.tmpPath('uploads/categories'))
//     url = await Drive.getUrl(`/categories/${image.fileName}`)
//   } else if (request.file('productImages')) {
//     image = request.file('productImages')
//     await image.move(app.tmpPath('uploads/products'))
//     url = await Drive.getUrl(`/products/${image.fileName}`)
//   } else if (request.file('shop_images')) {
//     image = request.file('shop_images')
//     await image.move(app.tmpPath('uploads/shop_logo'))
//     url = await Drive.getUrl(`/shop_logo/${image.fileName}`)
//   } else if (request.file('profile_image')) {
//     image = request.file('profile_image')
//     await image.move(app.tmpPath('uploads/profile_pictures'))
//     url = await Drive.getUrl(`/profile_pictures/${image.fileName}`)
//   } else {
//     image = request.file('images')
//     await image.move(app.tmpPath('uploads'))
//     url = await Drive.getUrl(image.fileName)
//   }

//   response.ok({
//     code: 200,
//     message: 'Image uploaded successfully.',
//     data: url,
//   })
// })

router.get('/swagger', async () => {
  return AutoSwagger.default.docs(router.toJSON(), swagger)
})

router.get('/docs', async () => {
  return AutoSwagger.default.ui('/swagger', swagger)
})

import '#start/routes/auth'
import '#start/routes/user'
import '#start/routes/menu'
import '#start/routes/role'
import '#start/routes/permission'
import '#start/routes/shop'
import '#start/routes/attribute'
import '#start/routes/category'
import '#start/routes/product'
import '#start/routes/variant'
