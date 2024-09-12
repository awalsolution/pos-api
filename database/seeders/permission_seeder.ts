import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Permission from '#models/permission'

export default class extends BaseSeeder {
  async run() {
    await Permission.createMany([
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
        name: 'assign permission menu',
        type: 'public',
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
    ])
  }
}
