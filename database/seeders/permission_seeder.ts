import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Permission from '#models/permission'

export default class extends BaseSeeder {
  async run() {
    await Permission.createMany([
      {
        name: 'home menu',
        type: 'public',
        created_by: 'Iqbal Hassan',
      },
      {
        name: 'admin menu',
        type: 'public',
        created_by: 'Iqbal Hassan',
      },
      {
        name: 'management menu',
        type: 'public',
        created_by: 'Iqbal Hassan',
      },
      {
        name: 'dashboard menu',
        type: 'public',
        created_by: 'Iqbal Hassan',
      },
      {
        name: 'tenant menu',
        type: 'private',
        created_by: 'Iqbal Hassan',
      },
      {
        name: 'tenant create',
        type: 'private',
        created_by: 'Iqbal Hassan',
      },
      {
        name: 'tenant update',
        type: 'private',
        created_by: 'Iqbal Hassan',
      },
      {
        name: 'tenant delete',
        type: 'private',
        created_by: 'Iqbal Hassan',
      },
      {
        name: 'tenant profile',
        type: 'public',
        created_by: 'Iqbal Hassan',
      },
      {
        name: 'plan menu',
        type: 'private',
        created_by: 'Iqbal Hassan',
      },
      {
        name: 'plan create',
        type: 'private',
        created_by: 'Iqbal Hassan',
      },
      {
        name: 'plan update',
        type: 'private',
        created_by: 'Iqbal Hassan',
      },
      {
        name: 'plan delete',
        type: 'private',
        created_by: 'Iqbal Hassan',
      },
      {
        name: 'plan assign permission',
        type: 'public',
        created_by: 'Iqbal Hassan',
      },
      {
        name: 'permission menu',
        type: 'public',
        created_by: 'Iqbal Hassan',
      },
      {
        name: 'permission create',
        type: 'private',
        created_by: 'Iqbal Hassan',
      },
      {
        name: 'permission update',
        type: 'private',
        created_by: 'Iqbal Hassan',
      },
      {
        name: 'permission delete',
        type: 'private',
        created_by: 'Iqbal Hassan',
      },
      {
        name: 'user menu',
        type: 'public',
        created_by: 'Iqbal Hassan',
      },
      {
        name: 'user create',
        type: 'public',
        created_by: 'Iqbal Hassan',
      },
      {
        name: 'user update',
        type: 'public',
        created_by: 'Iqbal Hassan',
      },
      {
        name: 'user delete',
        type: 'public',
        created_by: 'Iqbal Hassan',
      },
      {
        name: 'user profile',
        type: 'public',
        created_by: 'Iqbal Hassan',
      },
      {
        name: 'user assign permission',
        type: 'public',
        created_by: 'Iqbal Hassan',
      },
      {
        name: 'role menu',
        type: 'public',
        created_by: 'Iqbal Hassan',
      },
      {
        name: 'role create',
        type: 'public',
        created_by: 'Iqbal Hassan',
      },
      {
        name: 'role update',
        type: 'public',
        created_by: 'Iqbal Hassan',
      },
      {
        name: 'role delete',
        type: 'public',
        created_by: 'Iqbal Hassan',
      },
      {
        name: 'role assign permission',
        type: 'public',
        created_by: 'Iqbal Hassan',
      },
      // tenant permissions
      {
        name: 'customer menu',
        type: 'public',
        created_by: 'Iqbal Hassan',
      },
      {
        name: 'customer create',
        type: 'public',
        created_by: 'Iqbal Hassan',
      },
      {
        name: 'customer update',
        type: 'public',
        created_by: 'Iqbal Hassan',
      },
      {
        name: 'customer delete',
        type: 'public',
        created_by: 'Iqbal Hassan',
      },
      {
        name: 'inventory menu',
        type: 'public',
        created_by: 'Iqbal Hassan',
      },
      {
        name: 'inventory create',
        type: 'public',
        created_by: 'Iqbal Hassan',
      },
      {
        name: 'inventory update',
        type: 'public',
        created_by: 'Iqbal Hassan',
      },
      {
        name: 'inventory delete',
        type: 'public',
        created_by: 'Iqbal Hassan',
      },
      {
        name: 'inventoryCategory menu',
        type: 'public',
        created_by: 'Iqbal Hassan',
      },
      {
        name: 'inventoryCategory create',
        type: 'public',
        created_by: 'Iqbal Hassan',
      },
      {
        name: 'inventoryCategory update',
        type: 'public',
        created_by: 'Iqbal Hassan',
      },
      {
        name: 'inventoryCategory delete',
        type: 'public',
        created_by: 'Iqbal Hassan',
      },
      {
        name: 'purchase menu',
        type: 'public',
        created_by: 'Iqbal Hassan',
      },
      {
        name: 'purchase create',
        type: 'public',
        created_by: 'Iqbal Hassan',
      },
      {
        name: 'purchase update',
        type: 'public',
        created_by: 'Iqbal Hassan',
      },
      {
        name: 'purchase delete',
        type: 'public',
        created_by: 'Iqbal Hassan',
      },
      {
        name: 'vendor menu',
        type: 'public',
        created_by: 'Iqbal Hassan',
      },
      {
        name: 'vendor create',
        type: 'public',
        created_by: 'Iqbal Hassan',
      },
      {
        name: 'vendor update',
        type: 'public',
        created_by: 'Iqbal Hassan',
      },
      {
        name: 'vendor delete',
        type: 'public',
        created_by: 'Iqbal Hassan',
      },
    ])
  }
}
