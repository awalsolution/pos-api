/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/
import AutoSwagger from 'adonis-autoswagger'
import swagger from '#config/swagger'
import router from '@adonisjs/core/services/router'
const AuthController = () => import('#controllers/auth_controller')
const UploadController = () => import('#controllers/upload_controller')

router.get('/', async ({ response }) => {
  response.ok({
    code: 200,
    data: "Awal HR Management System REST API's is Started.",
  })
})

router.get('/swagger', async () => {
  return AutoSwagger.default.docs(router.toJSON(), swagger)
})
router.get('/docs', async () => {
  return AutoSwagger.default.ui('/swagger', swagger)
  // return AutoSwagger.default.scalar("/swagger"); to use Scalar instead
  // return AutoSwagger.default.rapidoc("/swagger", "view"); to use RapiDoc instead (pass "view" default, or "read" to change the render-style)
})

router.post('/api/v1/tenant-register', [AuthController, 'tenantRegister'])
router.post('/api/v1/upload', [UploadController, 'imageUploader'])
router.get('/api/v1/verify-domain/:name', [AuthController, 'verifyDomainName'])

//tenants
import '#start/routes/tenant/customer'
import '#start/routes/tenant/supplier'
import '#start/routes/tenant/purchase'
import '#start/routes/tenant/product'
import '#start/routes/tenant/product_categories'
//admin
import '#start/routes/menu'
import '#start/routes/auth'
import '#start/routes/user'
import '#start/routes/plan'
import '#start/routes/role'
import '#start/routes/permission'
import '#start/routes/tenant'
