/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router.get('/logo', () => {})
    router.get('/slider', () => {})
    router.get('/home', () => {})
  })
  .prefix('/api/v1/client')
