// import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { BaseModel } from '@adonisjs/lucid/orm'
import _ from 'lodash'

export default class BaseController {
  declare MODEL: typeof BaseModel

  async toJSON(payload: any) {
    if (typeof payload === 'string') {
      return JSON.parse(payload)
    }
    return JSON.parse(JSON.stringify(payload))
  }

  ischeckAllSuperAdminUser(user: User) {
    if (user && user.shopId === null) {
      return true
    }
    return false
  }

  checkRole(user?: User, role?: string) {
    if (user?.roles && user.roles.length) {
      const roles = user.roles.filter((userRole) => userRole.name === role)
      return roles.length > 0
    }
  }

  isSuperAdmin(user?: User) {
    return this.checkRole(user, 'super admin')
  }

  async allPermissions(user?: User) {
    let rolePermissions: string[] = []
    console.log(user)
    if (user?.roles) {
      for (const role of user.roles) {
        rolePermissions = [...role.permissions.map((permission) => permission.name)]
      }
    }
    let userPermissions = user?.permissions.map((permission) => permission.name) || []

    return _.uniq([...userPermissions, ...rolePermissions])
  }
}
