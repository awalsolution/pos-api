import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import { roleHasPermission } from 'Database/data/roleHasPermission';
import Role from 'App/Models/Acl/Role';
import Permission from 'App/Models/Acl/Permission';

export default class PermissionRoleSeeder extends BaseSeeder {
  public async run() {
    try {
      for (const i in roleHasPermission) {
        const foundRole = await Role.findBy('id', roleHasPermission[i].role);
        if (foundRole) {
          let permissions: number[] = [];
          const perms = roleHasPermission[i].permissions;
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

          await foundRole.related('permissions').detach();
          await foundRole.related('permissions').attach(permissions);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
}
