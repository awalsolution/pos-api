import { HttpContext } from '@adonisjs/core/http'
import TenancyNotInitializedException from '#exceptions/tenancy_not_initialized_exception'
import Tenant from '#models/tenant'
import db from '@adonisjs/lucid/services/db'
import env from '#start/env'

export default class TenancyByRequestHeader {
  async handle({ request }: HttpContext, next: () => Promise<void>) {
    if (!request.headers().X_Tenant_Key) {
      throw new TenancyNotInitializedException('Invalid Request. Missing Tenant key.', 403)
    }
    const tenant = await Tenant.findBy('tenant_api_key', request.headers().X_Tenant_Key)
    if (!tenant?.db_name) {
      throw new TenancyNotInitializedException('Invalid keys provided.', 403)
    }
    const conn = db.manager.get('tenant')
    //@ts-ignore
    if (!conn?.connection || conn?.config.connection?.database !== tenant?.db_name) {
      db.manager.patch('tenant', {
        client: 'mysql2',
        connection: {
          host: env.get('DB_HOST'),
          port: env.get('DB_PORT'),
          user: env.get('DB_USER'),
          password: env.get('DB_PASSWORD'),
          database: tenant?.db_name,
        },
      })
    }
    await next()
  }
}
