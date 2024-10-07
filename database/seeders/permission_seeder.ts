import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Permission from '#models/permission'

export default class extends BaseSeeder {
  async run() {
    await Permission.createMany([
      {
        menuId: 1,
        name: 'dashboard menu',
        type: 'public',
        created_by: 'Iqbal Hassan',
      },
      {
        menuId: 2,
        name: 'menu menu',
        type: 'public',
        created_by: 'Iqbal Hassan',
      },
      {
        menuId: 2,
        name: 'menu create',
        type: 'public',
        created_by: 'Iqbal Hassan',
      },
      {
        menuId: 2,
        name: 'menu update',
        type: 'public',
        created_by: 'Iqbal Hassan',
      },
      {
        menuId: 2,
        name: 'menu delete',
        type: 'public',
        created_by: 'Iqbal Hassan',
      },
      {
        menuId: 3,
        name: 'tenant menu',
        type: 'private',
        created_by: 'Iqbal Hassan',
      },
      {
        menuId: 3,
        name: 'tenant create',
        type: 'private',
        created_by: 'Iqbal Hassan',
      },
      {
        menuId: 3,
        name: 'tenant update',
        type: 'private',
        created_by: 'Iqbal Hassan',
      },
      {
        menuId: 3,
        name: 'tenant delete',
        type: 'private',
        created_by: 'Iqbal Hassan',
      },
      {
        menuId: 3,
        name: 'tenant profile',
        type: 'public',
        created_by: 'Iqbal Hassan',
      },
      {
        menuId: 4,
        name: 'plan menu',
        type: 'private',
        created_by: 'Iqbal Hassan',
      },
      {
        menuId: 4,
        name: 'plan create',
        type: 'private',
        created_by: 'Iqbal Hassan',
      },
      {
        menuId: 4,
        name: 'plan update',
        type: 'private',
        created_by: 'Iqbal Hassan',
      },
      {
        menuId: 4,
        name: 'plan delete',
        type: 'private',
        created_by: 'Iqbal Hassan',
      },
      {
        menuId: 4,
        name: 'plan assign permission',
        type: 'public',
        created_by: 'Iqbal Hassan',
      },
      {
        menuId: 5,
        name: 'permission menu',
        type: 'public',
        created_by: 'Iqbal Hassan',
      },
      {
        menuId: 5,
        name: 'permission create',
        type: 'private',
        created_by: 'Iqbal Hassan',
      },
      {
        menuId: 5,
        name: 'permission update',
        type: 'private',
        created_by: 'Iqbal Hassan',
      },
      {
        menuId: 5,
        name: 'permission delete',
        type: 'private',
        created_by: 'Iqbal Hassan',
      },
      {
        menuId: 6,
        name: 'user menu',
        type: 'public',
        created_by: 'Iqbal Hassan',
      },
      {
        menuId: 6,
        name: 'user create',
        type: 'public',
        created_by: 'Iqbal Hassan',
      },
      {
        menuId: 6,
        name: 'user update',
        type: 'public',
        created_by: 'Iqbal Hassan',
      },
      {
        menuId: 6,
        name: 'user delete',
        type: 'public',
        created_by: 'Iqbal Hassan',
      },
      {
        menuId: 6,
        name: 'user profile',
        type: 'public',
        created_by: 'Iqbal Hassan',
      },
      {
        menuId: 6,
        name: 'user assign permission',
        type: 'public',
        created_by: 'Iqbal Hassan',
      },
      {
        menuId: 7,
        name: 'role menu',
        type: 'public',
        created_by: 'Iqbal Hassan',
      },
      {
        menuId: 7,
        name: 'role create',
        type: 'public',
        created_by: 'Iqbal Hassan',
      },
      {
        menuId: 7,
        name: 'role update',
        type: 'public',
        created_by: 'Iqbal Hassan',
      },
      {
        menuId: 7,
        name: 'role delete',
        type: 'public',
        created_by: 'Iqbal Hassan',
      },
      {
        menuId: 7,
        name: 'role assign permission',
        type: 'public',
        created_by: 'Iqbal Hassan',
      },
    ])
  }
}
