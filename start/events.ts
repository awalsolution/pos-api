import emitter from '@adonisjs/core/services/emitter'
import AllTenantInsertPermissionEvent from '#events/all_tenant_insert_permission_event'
const AllTenantInsertPermissionListener = () =>
  import('#listeners/all_tenant_insert_permission_listener')
import SingleTenantInsertPermissionEvent from '#events/single_tenant_insert_permission_event'
const SingleTenantInsertPermissionListener = () =>
  import('#listeners/single_tenant_insert_permission_listener')

emitter.on(AllTenantInsertPermissionEvent, [AllTenantInsertPermissionListener])
emitter.on(SingleTenantInsertPermissionEvent, [SingleTenantInsertPermissionListener])
