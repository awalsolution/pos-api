import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";
import { rolesPermissions } from "Database/data/roles_permissions";
import Role from "App/Models/Role";
import Permission from "App/Models/Permission";

export default class PermissionRoleSeeder extends BaseSeeder {
  public async run() {
    try {
      for (const i in rolesPermissions) {
        const foundRole = await Role.findBy("name", rolesPermissions[i].role);
        if (foundRole) {
          let permissions: number[] = [];
          const perms = rolesPermissions[i].permissions;
          for (const j in perms) {
            try {
              const foundPermission = await Permission.findBy("name", perms[j]);
              if (foundPermission) {
                const id = foundPermission?.id;
                permissions.push(id);
              }
            } catch (error) {
              console.log(error);
            }
          }

          await foundRole.related("permissions").detach();
          await foundRole.related("permissions").attach(permissions);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
}
