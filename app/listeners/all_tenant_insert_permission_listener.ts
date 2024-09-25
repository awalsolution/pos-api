import Tenant from '#models/tenant'
import Permission from '#models/permission'
import { tenantConnectionPatch } from '#services/db_connection_switcher_service'
import logger from '@adonisjs/core/services/logger'
import Role from '#models/role'

export default class AllTenantInsertPermissionListener {
  async handle(event: any) {
    const plan_id = event.data.plan_id
    const permissions = event.data.permissions
    const tenants = await Tenant.query().where('plan_id', plan_id)
    if (tenants.length > 0) {
      if (permissions.length > 0) {
        for (const tenant of tenants) {
          const masterDbPermissions = await Permission.query().whereIn('id', permissions)
          const toDeletePermissions = masterDbPermissions.map((p) => p.name)
          tenantConnectionPatch(tenant.db_name)
          for (const id of permissions) {
            // find from master db
            const permission: any = await Permission.query().where('id', id).first()
            const pExist = await Permission.query({ connection: 'tenant' })
              .where('name', permission.name)
              .first()
            if (!pExist) {
              const p = await Permission.create(
                {
                  name: permission.name,
                  type: permission.type,
                  status: permission.status,
                  created_by: 'system',
                },
                { connection: 'tenant' }
              )
              logger.info(`Inserted permission ==> ${p.name} for tenant ==> ${tenant.tenant_name}`)
              const role = await Role.findBy('created_by', 'system', { connection: 'tenant' })
              role?.related('permissions').attach([p.id])
              logger.info(`Assign permission ==> ${p.name} to role ==> ${role?.name}`)
            } else {
              logger.info(
                `Permission ==> ${pExist?.name} already exists in tenant db ==> ${tenant.tenant_name}`
              )
            }
          }
          await Permission.query({ connection: 'tenant' })
            .whereNotIn('name', toDeletePermissions)
            .delete()
          logger.info(`Permission deleted for tenant ==> ${tenant.tenant_name}`)
        }
      } else {
        logger.info('No permissions found for the plan.')
      }
    } else {
      logger.info('No tenants exist for the plan!')
    }
  }
}
