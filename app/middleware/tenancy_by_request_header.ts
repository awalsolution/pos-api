import { HttpContext } from '@adonisjs/core/http'
import TenancyNotInitializedException from '#exceptions/tenancy_not_initialized_exception'
import {
  tenantConnectionSwitcher,
  adminConnectionSwitcher,
} from '#services/db_connection_switcher_service'
import Tenant from '#models/tenant'

export default class TenancyByRequestHeader {
  async handle({ request }: HttpContext, next: () => Promise<void>) {
    if (request.headers().tenant_api_public_key) {
      await adminConnectionSwitcher()
      const tenant = await Tenant.findBy('tenant_api_key', request.headers().tenant_api_public_key)
      if (!tenant?.db_name) {
        throw new TenancyNotInitializedException(
          'Invalid tenant api key provided. Please contact with Service provider support.',
          403
        )
      }
      // tenant connnection
      if (tenant?.db_name) {
        await tenantConnectionSwitcher(tenant?.db_name)
      }
    } else {
      // admin connection
      await adminConnectionSwitcher()
    }
    await next()
  }
}
