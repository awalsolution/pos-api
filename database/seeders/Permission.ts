import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
// import { permissions } from '../data/permissions';
import Permission from 'App/Models/Acl/Permission';

export default class extends BaseSeeder {
  public async run() {
    await Permission.createMany([
      { name: 'can view dashboard' },
      { name: 'can view system setting' },
      { name: 'can view users' },
      { name: 'can view users create' },
      { name: 'can view users update' },
      { name: 'can view users delete' },
      { name: 'can view profile' },
      { name: 'can view roles' },
      { name: 'can view roles create' },
      { name: 'can view roles update' },
      { name: 'can view roles delete' },
      { name: 'can view permissions' },
      { name: 'can view permissions create' },
      { name: 'can view permissions update' },
      { name: 'can view permissions delete' },
      { name: 'can view shops' },
      { name: 'can view shops create' },
      { name: 'can view shops update' },
      { name: 'can view shops delete' },
      { name: 'can view products' },
      { name: 'can view products create' },
      { name: 'can view products update' },
      { name: 'can view products delete' },
      { name: 'can view Attributes' },
      { name: 'can view Attributes create' },
      { name: 'can view Attributes update' },
      { name: 'can view Attributes delete' },
      { name: 'can view Categories' },
      { name: 'can view Categories create' },
      { name: 'can view Categories update' },
      { name: 'can view Categories delete' },
    ]);
  }
}
