import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import Permission from 'App/Models/Acl/Permission';

export default class extends BaseSeeder {
  public async run() {
    await Permission.createMany([
      { name: 'can view dashboard' },
      { name: 'can view system setting' },
      { name: 'can view users' },
      { name: 'can view user create' },
      { name: 'can view user update' },
      { name: 'can view user delete' },
      { name: 'can view profile' },
      { name: 'can view roles' },
      { name: 'can view role create' },
      { name: 'can view role update' },
      { name: 'can view role delete' },
      { name: 'can view permissions' },
      { name: 'can view permission create' },
      { name: 'can view permission update' },
      { name: 'can view permission delete' },
      { name: 'can view shops' },
      { name: 'can view shop create' },
      { name: 'can view shop update' },
      { name: 'can view shop delete' },
      { name: 'can view products' },
      { name: 'can view product create' },
      { name: 'can view product update' },
      { name: 'can view product delete' },
      { name: 'can view product import' },
      { name: 'can view product export' },
      { name: 'can view attributes' },
      { name: 'can view attribute create' },
      { name: 'can view attribute update' },
      { name: 'can view attribute delete' },
      { name: 'can view categories' },
      { name: 'can view category create' },
      { name: 'can view category update' },
      { name: 'can view category delete' },
      { name: 'can view variants' },
      { name: 'can view variant create' },
      { name: 'can view variant update' },
      { name: 'can view variant delete' },
    ]);
  }
}
