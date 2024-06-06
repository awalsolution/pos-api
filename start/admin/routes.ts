/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
const AuthController = () => import('#controllers/auth_controller')
const UserController = () => import('#controllers/admin/user_controller')
const PermissionController = () => import('#controllers/admin/permission_controller')
const RoleController = () => import('#controllers/admin/role_controller')
const PlanController = () => import('#controllers/admin/plan_controller')
const TenantController = () => import('#controllers/admin/tenant_controller')

router
  .group(() => {
    router
      .group(() => {
        router.post('/login', [AuthController, 'login'])
        router.post('/register', [AuthController, 'register'])
        router
          .group(() => {
            router.get('/logout', [AuthController, 'logout'])
            router.get('/authenticated', [AuthController, 'authenticated'])
          })
          .use(middleware.auth({ guards: ['api'] }))
      })
      .prefix('/auth')

    router
      .group(() => {
        router.get('/', [UserController, 'index'])
        router.post('/', [UserController, 'create'])
        router.get('/:id', [UserController, 'show'])
        router.put('/:id', [UserController, 'update'])
        router.put('/assign-permission/:id', [UserController, 'assignPermission'])
        router.put('/status/:id', [UserController, 'updateStatus'])
        router.put('/profile/:id', [UserController, 'profileUpdate'])
        router.delete('/:id', [UserController, 'destroy'])
      })
      .use(middleware.auth({ guards: ['api'] }))
      .prefix('/user')

    router
      .group(() => {
        router.get('/', [RoleController, 'index'])
        router.post('/', [RoleController, 'create'])
        router.get('/:id', [RoleController, 'show'])
        router.put('/:id', [RoleController, 'update'])
        router.put('/assign-permission/:id', [RoleController, 'assignPermission'])
        router.delete('/:id', [RoleController, 'destroy'])
      })
      .use(middleware.auth({ guards: ['api'] }))
      .prefix('/role')

    router
      .group(() => {
        router.get('/', [PermissionController, 'index'])
        router.post('/', [PermissionController, 'create'])
        router.get('/:id', [PermissionController, 'show'])
        router.put('/:id', [PermissionController, 'update'])
        router.delete('/:id', [PermissionController, 'destroy'])
      })
      .use(middleware.auth({ guards: ['api'] }))
      .prefix('/permission')

    router
      .group(() => {
        router.get('/', [TenantController, 'index'])
        router.post('/', [TenantController, 'create'])
        router.get('/:id', [TenantController, 'show'])
        router.put('/:id', [TenantController, 'update'])
        router.delete('/:id', [TenantController, 'destroy'])
        router.get('/detail/:db_name', [TenantController, 'tenantDetailInfo'])
      })
      .use(middleware.auth({ guards: ['api'] }))
      .prefix('/tenant')

    router
      .group(() => {
        router.get('/', [PlanController, 'index'])
        router.post('/', [PlanController, 'create'])
        router.get('/:id', [PlanController, 'show'])
        router.put('/:id', [PlanController, 'update'])
        router.delete('/:id', [PlanController, 'destroy'])
      })
      .use(middleware.auth({ guards: ['api'] }))
      .prefix('/plan')
  })
  .use(middleware.tenant())
  .prefix('/api/v1/admin')
