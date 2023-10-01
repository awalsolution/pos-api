import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import { userHasRole } from 'Database/data/userHasRoles';
import User from 'App/Models/User';
import Role from 'App/Models/Acl/Role';

export default class extends BaseSeeder {
  public async run() {
    try {
      for (const i in userHasRole) {
        const foundUser = await User.findBy('id', userHasRole[i].user);
        if (foundUser) {
          let roles: number[] = [];
          const perms: any = userHasRole[i].roles;
          for (const j in perms) {
            try {
              const foundRole = await Role.findBy('id', perms[j]);
              if (foundRole) {
                const id = foundRole?.id;
                roles.push(id);
              }
            } catch (error) {
              console.log(error);
            }
          }

          await foundUser.related('roles').detach();
          await foundUser.related('roles').attach(roles);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
}
