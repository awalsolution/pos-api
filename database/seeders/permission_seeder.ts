import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Permission from '#models/permission'

export default class extends BaseSeeder {
  async run() {
    await Permission.createMany([
      { menuId: 1, name: 'can view dashboard menu', type: 'public' },
      { menuId: 2, name: 'can view tenant menu', type: 'private' },
      { menuId: 2, name: 'can view tenant create', type: 'private' },
      { menuId: 2, name: 'can view tenant update', type: 'private' },
      { menuId: 2, name: 'can view tenant delete', type: 'private' },
      { menuId: 3, name: 'can view user menu', type: 'public' },
      { menuId: 3, name: 'can view user create', type: 'public' },
      { menuId: 3, name: 'can view user update', type: 'public' },
      { menuId: 3, name: 'can view user delete', type: 'public' },
      { menuId: 3, name: 'can view user profile', type: 'public' },
      { menuId: 3, name: 'can view user assign permission', type: 'public' },
      { menuId: 4, name: 'can view role menu', type: 'public' },
      { menuId: 4, name: 'can view role create', type: 'public' },
      { menuId: 4, name: 'can view role update', type: 'public' },
      { menuId: 4, name: 'can view role delete', type: 'public' },
      { menuId: 4, name: 'can view role assign permission', type: 'public' },
      { menuId: 5, name: 'can view permission menu', type: 'private' },
      { menuId: 5, name: 'can view permission create', type: 'private' },
      { menuId: 5, name: 'can view permission update', type: 'private' },
      { menuId: 5, name: 'can view permission delete', type: 'private' },
      { menuId: 5, name: 'can view assign permission menu', type: 'public' },
      { menuId: 6, name: 'can view menu menu', type: 'private' },
      { menuId: 6, name: 'can view menu create', type: 'private' },
      { menuId: 6, name: 'can view menu update', type: 'private' },
      { menuId: 6, name: 'can view menu delete', type: 'private' },
      { menuId: 7, name: 'can view plan menu', type: 'private' },
      { menuId: 7, name: 'can view plan create', type: 'private' },
      { menuId: 7, name: 'can view plan update', type: 'private' },
      { menuId: 7, name: 'can view plan delete', type: 'private' },
    ])
  }
}
