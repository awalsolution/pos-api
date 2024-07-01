/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
const UploadController = () => import('#controllers/upload_controller')
const AuthController = () => import('#controllers/auth_controller')
const UserController = () => import('#controllers/user_controller')
const PermissionController = () => import('#controllers/permission_controller')
const RoleController = () => import('#controllers/role_controller')
const PlanController = () => import('#controllers/plan_controller')
const AgencyController = () => import('#controllers/tenant/agencies_controller')
const TenantController = () => import('#controllers/tenant_controller')
const BookingsController = () => import('#controllers/tenant/bookings_controller')

router.get('/', async ({ response }) => {
  response.ok({
    code: 200,
    data: "Awal HR Management System REST API's is Started.",
  })
})

router.post('/api/v1/tenant-register', [AuthController, 'tenantRegister'])
router.post('/api/v1/upload', [UploadController, 'imageUploader'])
router.get('/api/v1/verify-domain/:name', [AuthController, 'verifyDomainName'])

router
  .group(() => {
    // user routes
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
    // user routes
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
    // roles routes
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
    // permissions routes
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
    // tenant routes
    router
      .group(() => {
        router.get('/', [TenantController, 'index'])
        router.post('/', [TenantController, 'create'])
        router.get('/find-single-tenant/:id', [TenantController, 'show'])
        router.put('/edit-single-tenant/:id', [TenantController, 'update'])
        router.delete('/delete-single-tenant/:id', [TenantController, 'destroy'])
        // admin to tenant operations
        router.get('/find-single-tenant-details', [TenantController, 'tenantDetailInfo'])
        router.get('/all-permission/:db_name', [TenantController, 'allPermission'])
        router.put('/assign-permission/:id', [TenantController, 'assignPermission'])
        // admin to tenant database user operations
        router.get('/find-user-of-tenant', [TenantController, 'findSingleUserOfTenant'])
        router.put('/edit-user-of-tenant/:user_id', [TenantController, 'updateUserOfTenant'])
        // admin to tenant database roles operations
        router.post('/insert-role-of-tenant', [TenantController, 'InsertRoleOfTenant'])
        router.get('/find-roles-of-tenant', [TenantController, 'findRolesOfTenant'])
        router.delete('/delete-role-of-tenant', [TenantController, 'deleteRoleOfTenant'])
        // admin to tenant database permission operations
        router.post('/insert-permissions-of-tenant', [
          TenantController,
          'InsertPermissionsOfTenant',
        ])
        router.get('/find-permissions-of-tenant', [TenantController, 'findPermssionsOfTenant'])
        router.delete('/delete-permission-of-tenant/:permission_id', [
          TenantController,
          'deletePermissionOfTenant',
        ])
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
    router
      .group(() => {
        router.get('/', [AgencyController, 'index'])
        router.post('/', [AgencyController, 'create'])
        router.get('/:id', [AgencyController, 'show'])
        router.put('/:id', [AgencyController, 'update'])
        router.delete('/:id', [AgencyController, 'destroy'])
      })
      .use(middleware.auth({ guards: ['api'] }))
      .prefix('/agencies')
    router
      .group(() => {
        router.get('/', [BookingsController, 'index'])
        router.post('/', [BookingsController, 'create'])
        router.get('/:id', [BookingsController, 'show'])
        router.delete('/:id', [BookingsController, 'destroy'])
      })
      .use(middleware.auth({ guards: ['api'] }))
      .prefix('/bookings')
  })
  .use(middleware.tenant())
  .prefix('/api/v1')
