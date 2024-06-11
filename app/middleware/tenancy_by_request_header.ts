import { HttpContext } from '@adonisjs/core/http'
import TenancyNotInitializedException from '#exceptions/tenancy_not_initialized_exception'
import { tenantConnectionSwitcher } from '#services/db_connection_switcher_service'
import Tenant from '#models/tenant'
import db from '@adonisjs/lucid/services/db'

export default class TenancyByRequestHeader {
  async handle({ request }: HttpContext, next: () => Promise<void>) {
    if (request.headers().tenant_api_public_key) {
      const tenant = await Tenant.findBy(
        'tenant_api_key',
        request.headers().tenant_api_public_key,
        { connection: 'mysql' }
      )
      if (!tenant?.db_name) {
        throw new TenancyNotInitializedException(
          'Invalid tenant api key provided. Please contact with Service provider support.',
          403
        )
      }
      const conn = db.manager.get('tenant')
      //@ts-ignore
      if (!conn?.connection || conn?.config.connection?.database !== tenant?.db_name) {
        await tenantConnectionSwitcher(tenant?.db_name)
      }
    }
    await next()
  }
}
