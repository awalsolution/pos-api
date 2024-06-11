import User from '#models/user'

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
}
