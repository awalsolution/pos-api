import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import { userHasPermission } from 'Database/data/userHasPermission';
import User from 'App/Models/User';
import Permission from 'App/Models/Acl/Permission';

export default class extends BaseSeeder {
  public async run() {
    try {
      for (const i in userHasPermission) {
        const foundUser = await User.findBy('id', userHasPermission[i].user);
        if (foundUser) {
          let permissions: number[] = [];
          const perms: any = userHasPermission[i].permissions;
          for (const j in perms) {
            try {
              const foundPermission = await Permission.findBy('id', perms[j]);
              if (foundPermission) {
                const id = foundPermission?.id;
                permissions.push(id);
              }
            } catch (error) {
              console.log(error);
            }
          }

          await foundUser.related('permissions').detach();
          await foundUser.related('permissions').attach(permissions);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
}
