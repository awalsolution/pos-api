import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import Tenant from '#models/tenant'
export class BaseController {
  async checkRole(user?: User, role?: string) {
    if (user?.roles && user.roles.length) {
      const roles = user.roles.filter((userRole) => userRole.name === role)
      return roles.length > 0
    }
    return false
  }

  async isSuperAdmin(user?: User) {
    return this.checkRole(user, 'super admin')
  }

  async isTenant(ctx: HttpContext) {
    if (ctx.request.header('X-Tenant-Api-Key')) {
      const tenant = await Tenant.findBy('tenant_api_key', ctx.request.header('X-Tenant-Api-Key'), {
        connection: 'mysql',
      })
      return tenant?.serialize()
    }
  }
}
