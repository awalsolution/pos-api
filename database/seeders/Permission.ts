import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import Permission from 'App/Models/Acl/Permission';

export default class extends BaseSeeder {
  public async run() {
    await Permission.createMany([
      { name: 'can view dashboard', type: 'public' },
      { name: 'can view system setting', type: 'public' },
      { name: 'can view users', type: 'public' },
      { name: 'can view user create', type: 'public' },
      { name: 'can view user update', type: 'public' },
      { name: 'can view user delete', type: 'public' },
      { name: 'can view user profile', type: 'public' },
      { name: 'can view roles', type: 'public' },
      { name: 'can view role create', type: 'public' },
      { name: 'can view role update', type: 'public' },
      { name: 'can view role delete', type: 'public' },
      { name: 'can view permissions', type: 'public' },
      { name: 'can view permission create', type: 'public' },
      { name: 'can view permission update', type: 'public' },
      { name: 'can view permission delete', type: 'public' },
      { name: 'can view shops', type: 'public' },
      { name: 'can view shop create', type: 'public' },
      { name: 'can view shop update', type: 'public' },
      { name: 'can view shop delete', type: 'public' },
      { name: 'can view products', type: 'public' },
      { name: 'can view product create', type: 'public' },
      { name: 'can view product update', type: 'public' },
      { name: 'can view product delete', type: 'public' },
      { name: 'can view product import', type: 'public' },
      { name: 'can view product export', type: 'public' },
      { name: 'can view attributes', type: 'public' },
      { name: 'can view attribute create', type: 'public' },
      { name: 'can view attribute update', type: 'public' },
      { name: 'can view attribute delete', type: 'public' },
      { name: 'can view categories', type: 'public' },
      { name: 'can view category create', type: 'public' },
      { name: 'can view category update', type: 'public' },
      { name: 'can view category delete', type: 'public' },
      { name: 'can view variants', type: 'public' },
      { name: 'can view variant create', type: 'public' },
      { name: 'can view variant update', type: 'public' },
      { name: 'can view variant delete', type: 'public' },
      { name: 'can view customers', type: 'public' },
    ]);
  }
}
