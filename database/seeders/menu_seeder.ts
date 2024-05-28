import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Menu from '#models/menu'

export default class extends BaseSeeder {
  async run() {
    await Menu.createMany([
      {
        menu_name: 'Dashboard',
        menu_type: 'public',
      },
      {
        menu_name: 'Tenant',
        menu_type: 'private',
      },
      {
        menu_name: 'User',
        menu_type: 'public',
      },
      {
        menu_name: 'Role',
        menu_type: 'public',
      },
      {
        menu_name: 'Permission',
        menu_type: 'private',
      },
      {
        menu_name: 'Menu',
        menu_type: 'Public',
      },
      {
        menu_name: 'Plan',
        menu_type: 'private',
      },
    ])
  }
}
