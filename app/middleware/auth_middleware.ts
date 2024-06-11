import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import type { Authenticators } from '@adonisjs/auth/types'
import {
  ReplaceAdminToTenantConnectionSwitcher,
  adminConnectionSwitcher,
} from '#services/db_connection_switcher_service'
import Tenant from '#models/tenant'
import TenancyNotInitializedException from '#exceptions/tenancy_not_initialized_exception'

/**
 * Auth middleware is used authenticate HTTP requests and deny
 * access to unauthenticated users.
 */
export default class AuthMiddleware {
  /**
   * The URL to redirect to, when authentication fails
   */
  redirectTo = '/login'

  async handle(
    ctx: HttpContext,
    next: NextFn,
    options: {
      guards?: (keyof Authenticators)[]
    } = {}
  ) {
    if (ctx.request.headers().tenant_api_public_key) {
      await adminConnectionSwitcher()
      const tenant = await Tenant.findBy(
        'tenant_api_key',
        ctx.request.headers().tenant_api_public_key
      )
      if (!tenant?.db_name) {
        throw new TenancyNotInitializedException(
          'Invalid tenant api key provided. Please contact with Service provider support.',
          403
        )
      }
      await ReplaceAdminToTenantConnectionSwitcher(tenant?.db_name)
    }
    await ctx.auth.authenticateUsing(options.guards, { loginRoute: this.redirectTo })
    await adminConnectionSwitcher()
    return next()
  }
}
