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
const UploadController = () => import('#controllers/upload_controller')

// import app from '@adonisjs/core/services/app'
// import { cuid } from '@adonisjs/core/helpers'

import AutoSwagger from 'adonis-autoswagger'
import swagger from '#config/swagger'

router.get('/', async () => {
  return "InSync CRM API's is Started."
})

router.get('/swagger', async () => {
  return AutoSwagger.default.docs(router.toJSON(), swagger)
})

router.get('/docs', async () => {
  return AutoSwagger.default.ui('/swagger', swagger)
})

// async function imageUploader(fieldName: string, request: any, basePath: string) {
//   if (request.file(fieldName)) {
//     const image = request.file(fieldName)
//     const imageNewGeneratedName = cuid() + '.' + image.extname
//     await image.move(app.makePath(basePath + fieldName), { name: imageNewGeneratedName })
//     return `/${basePath}${fieldName}/${imageNewGeneratedName}`
//   }
//   return null
// }

// router.post('/api/v1/upload', async ({ request, response }: HttpContext) => {
//   const fields = ['categories', 'products', 'shops_logo', 'profile_picture', 'images']
//   const basePath: string = 'uploads/'

//   let url: string | null = null

//   for (const field of fields) {
//     url = await imageUploader(field, request, basePath)
//     if (url) break
//   }

//   if (!url) {
//     return response.badRequest({
//       code: 400,
//       message: 'Something went wrong! image not uploaded please try again!',
//       data: null,
//     })
//   }

//   response.ok({
//     code: 200,
//     message: 'Image uploaded successfully.',
//     data: url,
//   })
// })

router.post('/api/v1/upload', [UploadController, 'imageUploader'])

import '#start/routes/auth'
import '#start/routes/customer'
import '#start/routes/user'
import '#start/routes/menu'
import '#start/routes/role'
import '#start/routes/permission'
import '#start/routes/shop'
import '#start/routes/attribute'
import '#start/routes/category'
import '#start/routes/product'
import '#start/routes/variant'
import '#start/routes/payment_method'
import '#start/routes/order'
import '#start/routes/shipment_address'
