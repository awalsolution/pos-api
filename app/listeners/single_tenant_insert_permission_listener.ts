import { tenantConnectionPatch } from '#services/db_connection_switcher_service'
import logger from '@adonisjs/core/services/logger'
import Permission from '#models/permission'
import Plan from '#models/plan'
import Role from '#models/role'

export default class SingleTenantInsertPermissionListener {
  async handle(event: any) {
    const plan_id = event.data.plan_id
    const db = event.data.db
    const plan: any = await Plan.query().preload('permissions').where('id', plan_id).first()
    if (db && plan.permissions.length > 0) {
      const toDeletePermissions = plan.permissions.map((p: any) => p.name)
      tenantConnectionPatch(db)
      for (const item of plan.permissions) {
        const pExist = await Permission.query({ connection: 'tenant' })
          .where('name', item.name)
          .first()
        if (!pExist) {
          const p = await Permission.create(
            {
              name: item.name,
              type: item.type,
              status: item.status,
              created_by: 'system',
            },
            { connection: 'tenant' }
          )
          logger.info(`Inserted permission ==> ${p.name} for db ==> ${db}`)
          const role = await Role.findBy('created_by', 'system', { connection: 'tenant' })
          role?.related('permissions').attach([p.id])
          logger.info(`Assign permission ==> ${p.name} to role ==> ${role?.name}`)
        } else {
          logger.info(`Permission ==> ${pExist?.name} already exists in tenant db ==> ${db}`)
        }
      }
      await Permission.query({ connection: 'tenant' })
        .whereNotIn('name', toDeletePermissions)
        .delete()
      logger.info(`Permission deleted for tenant db ==> ${db}`)
    } else {
      logger.info(`No permissions found for the plan ==> ${plan.name}`)
    }
  }
}
