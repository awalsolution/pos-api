import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
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
      {
        name: 'admin',
        shopId: 1,
      },
      {
        name: 'manager',
        shopId: 1,
      },
      {
        name: 'admin',
        shopId: 2,
      },
      {
        name: 'manager',
        shopId: 2,
      },
      {
        name: 'admin',
        shopId: 3,
      },
      {
        name: 'manager',
        shopId: 3,
      },
    ]);
  }
}
