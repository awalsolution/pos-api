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
import '#start/admin/auth'
import '#start/admin/client'
import '#start/admin/user'
import '#start/admin/menu'
import '#start/admin/role'
import '#start/admin/permission'
import '#start/admin/shop'
import '#start/admin/category'
import '#start/admin/product'
import '#start/admin/variant'
import '#start/admin/payment_method'
import '#start/admin/order'
