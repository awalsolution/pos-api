import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
const TenantController = () => import('#controllers/tenant_controller')

router
  .group(() => {
    router.get('/', [TenantController, 'index'])
    router.post('/', [TenantController, 'create'])
    router.post('/tenant-activation/:id', [TenantController, 'tenantActivation'])
    router.get('/find-single-tenant/:id', [TenantController, 'show'])
    router.put('/edit-single-tenant/:id', [TenantController, 'update'])
    router.put('/edit-single-tenant-plan/:id', [TenantController, 'EditPlan'])
    router.delete('/delete-single-tenant/:id', [TenantController, 'destroy'])
    router.get('/find-single-tenant-details', [TenantController, 'tenantDetailInfo'])
    router.get('/find-single-tenant-profile/:apiKey', [TenantController, 'findTenantProfile'])
    router.put('/edit-single-tenant-profile/:id', [TenantController, 'EditTenantProfile'])
    // router.get('/all-permission/:db_name', [TenantController, 'allPermission'])
    // router.put('/assign-permission/:id', [TenantController, 'assignPermission'])
    // // admin to tenant database user operations
    // router.get('/find-user-of-tenant', [TenantController, 'findSingleUserOfTenant'])
    // router.put('/edit-user-of-tenant/:user_id', [TenantController, 'updateUserOfTenant'])
    // // admin to tenant database roles operations
    // router.post('/insert-role-of-tenant', [TenantController, 'InsertRoleOfTenant'])
    // router.get('/find-roles-of-tenant', [TenantController, 'findRolesOfTenant'])
    // router.delete('/delete-role-of-tenant', [TenantController, 'deleteRoleOfTenant'])
    // // admin to tenant database permission operations
    // router.post('/insert-permissions-of-tenant', [
    //   TenantController,
    //   'InsertPermissionsOfTenant',
    // ])
    // router.get('/find-permissions-of-tenant', [TenantController, 'findPermssionsOfTenant'])
    router.delete('/delete-permission-of-tenant/:id', [
      TenantController,
      'deletePermissionOfTenant',
    ])
  })
  .use([middleware.auth({ guards: ['api'] }), middleware.tenant()])
  .prefix('/api/v1/tenants')
