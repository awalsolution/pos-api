// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { BaseModel } from '@ioc:Adonis/Lucid/Orm';
// import HttpCodes from 'App/Enums/HttpCodes';
// import Pagination from 'App/Enums/Pagination';
import User from 'App/Models/User';
import _ from 'lodash';

export class BaseController {
  public MODEL: typeof BaseModel;

  public toJSON(payload: any) {
    if (typeof payload === 'string') {
      return JSON.parse(payload);
    }
    return JSON.parse(JSON.stringify(payload));
  }

  public checkRole(user?: User, role?: string) {
    if (user?.roles && user.roles.length) {
      const roles = user.roles.filter((userRole) => userRole.name === role);
      return roles.length > 0;
    }
    return false;
  }

  public isAdmin(user?: User) {
    return this.checkRole(user, 'admin');
  }

  public isSuperAdmin(user?: User) {
    return this.checkRole(user, 'super admin');
  }

  public allPermissions(user?: User) {
    let rolePermissions: string[] = [];
    console.log(user);
    if (user?.roles) {
      for (const role of user.roles) {
        rolePermissions = [
          ...role.permissions.map((permission) => permission.name),
        ];
      }
    }
    let userPermissions =
      user?.permissions.map((permission) => permission.name) || [];

    return _.uniq([...userPermissions, ...rolePermissions]);
  }
}
