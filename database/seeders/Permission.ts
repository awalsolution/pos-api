import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import Permission from 'App/Models/Acl/Permission';

export default class extends BaseSeeder {
  public async run() {
    await Permission.createMany([
      { menuId: 1, name: 'can view dashboard', type: 'public' },
      { menuId: 2, name: 'can view system setting', type: 'public' },
      { menuId: 2, name: 'can view users', type: 'public' },
      { menuId: 2, name: 'can view user create', type: 'public' },
      { menuId: 2, name: 'can view user update', type: 'public' },
      { menuId: 2, name: 'can view user delete', type: 'public' },
      { menuId: 2, name: 'can view user profile', type: 'public' },
      { menuId: 2, name: 'can view roles', type: 'public' },
      { menuId: 2, name: 'can view role create', type: 'public' },
      { menuId: 2, name: 'can view role update', type: 'public' },
      { menuId: 2, name: 'can view role delete', type: 'public' },
      { menuId: 2, name: 'can view permissions', type: 'public' },
      { menuId: 2, name: 'can view permission create', type: 'public' },
      { menuId: 2, name: 'can view permission update', type: 'public' },
      { menuId: 2, name: 'can view permission delete', type: 'public' },
      { menuId: 3, name: 'can view shops', type: 'public' },
      { menuId: 3, name: 'can view shop create', type: 'public' },
      { menuId: 3, name: 'can view shop update', type: 'public' },
      { menuId: 3, name: 'can view shop delete', type: 'public' },
      { menuId: 4, name: 'can view products', type: 'public' },
      { menuId: 4, name: 'can view product create', type: 'public' },
      { menuId: 4, name: 'can view product update', type: 'public' },
      { menuId: 4, name: 'can view product delete', type: 'public' },
      { menuId: 4, name: 'can view attributes', type: 'public' },
      { menuId: 4, name: 'can view attribute create', type: 'public' },
      { menuId: 4, name: 'can view attribute update', type: 'public' },
      { menuId: 4, name: 'can view attribute delete', type: 'public' },
      { menuId: 4, name: 'can view categories', type: 'public' },
      { menuId: 4, name: 'can view category create', type: 'public' },
      { menuId: 4, name: 'can view category update', type: 'public' },
      { menuId: 4, name: 'can view category delete', type: 'public' },
      { menuId: 4, name: 'can view variants', type: 'public' },
      { menuId: 4, name: 'can view variant create', type: 'public' },
      { menuId: 4, name: 'can view variant update', type: 'public' },
      { menuId: 4, name: 'can view variant delete', type: 'public' },
    ]);
  }
}
