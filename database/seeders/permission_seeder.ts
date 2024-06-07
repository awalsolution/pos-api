import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Permission from '#models/permission'

export default class extends BaseSeeder {
  async run() {
    await Permission.createMany([
      {
        name: 'dashboard menu',
        type: 'public',
      },
      {
        name: 'tenant menu',
        type: 'private',
      },
      {
        name: 'tenant create',
        type: 'private',
      },
      {
        name: 'tenant update',
        type: 'private',
      },
      {
        name: 'tenant delete',
        type: 'private',
      },
      {
        name: 'plan menu',
        type: 'private',
      },
      {
        name: 'plan create',
        type: 'private',
      },
      {
        name: 'plan update',
        type: 'private',
      },
      {
        name: 'plan delete',
        type: 'private',
      },
      {
        name: 'user menu',
        type: 'public',
      },
      {
        name: 'user create',
        type: 'public',
      },
      {
        name: 'user update',
        type: 'public',
      },
      {
        name: 'user delete',
        type: 'public',
      },
      {
        name: 'user profile',
        type: 'public',
      },
      {
        name: 'user assign permission',
        type: 'public',
      },
      {
        name: 'role menu',
        type: 'public',
      },
      {
        name: 'role create',
        type: 'public',
      },
      {
        name: 'role update',
        type: 'public',
      },
      {
        name: 'role delete',
        type: 'public',
      },
      {
        name: 'role assign permission',
        type: 'public',
      },
      {
        name: 'permission menu',
        type: 'public',
      },
      {
        name: 'permission create',
        type: 'private',
      },
      {
        name: 'permission update',
        type: 'private',
      },
      {
        name: 'permission delete',
        type: 'private',
      },
      {
        name: 'assign permission menu',
        type: 'public',
      },
    ])
  }
}
