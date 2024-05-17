import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Permission from '#models/permission'

export default class extends BaseSeeder {
  async run() {
    await Permission.createMany([
      { name: 'can view dashboard menu', type: 'public' },
      { name: 'can view dashboard list', type: 'public' },
      { name: 'can view system setting menu', type: 'public' },
      { name: 'can view user menu', type: 'public' },
      { name: 'can view user create', type: 'public' },
      { name: 'can view user update', type: 'public' },
      { name: 'can view user delete', type: 'public' },
      { name: 'can view user profile', type: 'public' },
      { name: 'can view user assign permission', type: 'public' },
      { name: 'can view role menu', type: 'public' },
      { name: 'can view role create', type: 'public' },
      { name: 'can view role update', type: 'public' },
      { name: 'can view role delete', type: 'public' },
      { name: 'can view role assign permission', type: 'public' },
      { name: 'can view permission menu', type: 'private' },
      { name: 'can view permission create', type: 'private' },
      { name: 'can view permission update', type: 'private' },
      { name: 'can view permission delete', type: 'private' },
      { name: 'can view assign permission menu', type: 'public' },
    ])
  }
}
