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
const AuthController = () => import('#controllers/auth_controller')

router.get('/api/v1', async ({ response }) => {
  response.ok({
    code: 200,
    data: "Awal HR Management System REST API's is Started.",
  })
})

router.post('/api/v1/upload', [UploadController, 'imageUploader'])
router.get('/api/v1/verify-domain/:name', [AuthController, 'verifyDomainName'])

import '#start/admin/routes'
