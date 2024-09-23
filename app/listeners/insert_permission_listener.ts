import Tenant from '#models/tenant'
import Permission from '#models/permission'
import { tenantConnectionPatch } from '#services/db_connection_switcher_service'
import db from '@adonisjs/lucid/services/db'
import logger from '@adonisjs/core/services/logger'
import Plan from '#models/plan'

export default class InsertPermissionListener {
  async handle(data: any) {
    const tenants = await Tenant.query().where('plan_id', data.plan.id)
    if (tenants.length > 0) {
      const plan = await Plan.query().preload('permissions').where('id', data.plan.id).first()
      if (plan && plan.permissions.length > 0) {
        for (const tenant of tenants) {
          await tenantConnectionPatch(tenant.db_name)
          for (const permission of plan.permissions) {
            db.primaryConnectionName = 'tenant'
            const pExist = await Permission.query().where('name', permission.name).first()
            if (!pExist) {
              await Permission.create({
                name: permission.name,
                type: permission.type,
                status: permission.status,
                created_by: permission.created_by,
              })
              logger.info(`Inserted permission ${permission.name} for tenant ${tenant.tenant_name}`)
              db.primaryConnectionName = 'mysql'
            } else {
              logger.info(
                `Permission ${permission.name} already exists for tenant ${tenant.tenant_name}`
              )
              db.primaryConnectionName = 'mysql'
            }
          }
        }
      } else {
        logger.info('No permissions found for the plan.')
        db.primaryConnectionName = 'mysql'
      }
    } else {
      logger.info('No tenants exist for the plan!')
    }
  }
}
