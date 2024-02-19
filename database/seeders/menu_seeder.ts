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
        menu_name: 'System Setting',
        menu_type: 'public',
      },
      {
        menu_name: 'Shops',
        menu_type: 'private',
      },
      {
        menu_name: 'Products',
        menu_type: 'public',
      },
      {
        menu_name: 'Merchant',
        menu_type: 'public',
      },
      {
        menu_name: 'Supplier',
        menu_type: 'public',
      },
      {
        menu_name: 'Purchase',
        menu_type: 'public',
      },
    ])
  }
}
