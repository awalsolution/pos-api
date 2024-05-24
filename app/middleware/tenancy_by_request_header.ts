import { HttpContext } from '@adonisjs/core/http'
// import db from '@adonisjs/lucid/services/db'
import TenancyNotInitializedException from '#exceptions/tenancy_not_initialized_exception'
import {
  tenantConnectionSwitcher,
  adminConnectionSwitcher,
} from '#services/db_connection_switcher_service'
import Tenant from '#models/tenant'
// import env from '#start/env'

export default class TenancyByRequestHeader {
  async handle({ request }: HttpContext, next: () => Promise<void>) {
    if (request.headers().tenant_api_public_key) {
      const tenant = await Tenant.findBy('tenant_api_key', request.headers().tenant_api_public_key)
      if (!tenant?.db_name) {
        throw new TenancyNotInitializedException(
          'Invalid tenant key provided.Please contact with Service provider.',
          403
        )
      }
      // tenant connnection
      if (tenant?.db_name) {
        await tenantConnectionSwitcher(tenant?.db_name)
        // db.manager.patch('mysql', {
        //   client: 'mysql2',
        //   connection: {
        //     host: env.get('DB_HOST'),
        //     port: env.get('DB_PORT'),
        //     user: env.get('DB_USER'),
        //     password: env.get('DB_PASSWORD'),
        //     database: tenant?.db_name,
        //   },
        // })
      }
    } else {
      // admin connection
      await adminConnectionSwitcher()
      // db.manager.patch('mysql', {
      //   client: 'mysql2',
      //   connection: {
      //     host: env.get('DB_HOST'),
      //     port: env.get('DB_PORT'),
      //     user: env.get('DB_USER'),
      //     password: env.get('DB_PASSWORD'),
      //     database: env.get('DB_DATABASE'),
      //   },
      // })
    }
    await next()
  }
}
