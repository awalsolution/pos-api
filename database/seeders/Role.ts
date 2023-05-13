import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
// import { roles } from '../data/roles';
import Role from 'App/Models/Acl/Role';

export default class extends BaseSeeder {
  public async run() {
    await Role.createMany([
      {
        name: 'super admin',
      },
      {
        name: 'admin',
      },
      {
        name: 'vendor',
      },
    ]);
  }
}
