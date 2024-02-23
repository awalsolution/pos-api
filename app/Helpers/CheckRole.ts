import User from 'App/Models/User';

export class CheckRole {
  public ischeckAllSuperAdminUser(user: User) {
    if (user && user.shopId === null) {
      return true;
    }
    return false;
  }
}
