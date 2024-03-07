/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
const UploadController = () => import('#controllers/upload_controller')

import AutoSwagger from 'adonis-autoswagger'
import swagger from '#config/swagger'

router.get('/', async ({ response }) => {
  response.ok({
    code: 200,
    data: "InSync CRM API's is Started.",
  })
})

router.get('/swagger', async () => {
  return AutoSwagger.default.docs(router.toJSON(), swagger)
})

router.get('/docs', async () => {
  return AutoSwagger.default.ui('/swagger', swagger)
})

router.post('/api/v1/upload', [UploadController, 'imageUploader'])

import '#start/store/routes'
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
