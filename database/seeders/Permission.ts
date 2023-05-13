import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
// import { permissions } from '../data/permissions';
import Permission from 'App/Models/Acl/Permission';

export default class extends BaseSeeder {
  public async run() {
    await Permission.createMany([
      { name: 'can view dashboard' },
      { name: 'can view system setting' },
      { name: 'can view users' },
      { name: 'can view roles' },
      { name: 'can view permissions' },
      { name: 'can view shops' },
      { name: 'can view products' },
    ]);
  }
}
