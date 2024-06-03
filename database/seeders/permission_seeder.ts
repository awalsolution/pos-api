import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Permission from '#models/permission'

export default class extends BaseSeeder {
  async run() {
    await Permission.createMany([
      {
        name: 'dashboard menu',
      },
      {
        name: 'tenant menu',
      },
      {
        name: 'tenant create',
      },
      {
        name: 'tenant update',
      },
      {
        name: 'tenant delete',
      },
      {
        name: 'user menu',
      },
      {
        name: 'user create',
      },
      {
        name: 'user update',
      },
      {
        name: 'user delete',
      },
      {
        name: 'user profile',
      },
      {
        name: 'user assign permission',
      },
      {
        name: 'role menu',
      },
      {
        name: 'role create',
      },
      {
        name: 'role update',
      },
      {
        name: 'role delete',
      },
      {
        name: 'role assign permission',
      },
      {
        name: 'permission menu',
      },
      {
        name: 'permission create',
      },
      {
        name: 'permission update',
      },
      {
        name: 'permission delete',
      },
      {
        name: 'assign permission menu',
      },
      {
        name: 'menu menu',
      },
      {
        name: 'menu create',
      },
      {
        name: 'menu update',
      },
      {
        name: 'menu delete',
      },
      {
        name: 'plan menu',
      },
      {
        name: 'plan create',
      },
      {
        name: 'plan update',
      },
      {
        name: 'plan delete',
      },
    ])
  }
}
