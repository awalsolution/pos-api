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

router.get('/', async ({ response }) => {
  response.ok({
    code: 200,
    data: "Awal HR Management System REST API's is Started.",
  })
})

router.post('/api/v1/upload', [UploadController, 'imageUploader'])

import '#start/client/routes'
import '#start/admin/routes'
