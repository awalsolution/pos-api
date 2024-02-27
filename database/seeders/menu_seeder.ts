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
        menu_name: 'Order',
        menu_type: 'public',
      },
      {
        menu_name: 'Payment Method',
        menu_type: 'public',
      },
      {
        menu_name: 'Customer',
        menu_type: 'public',
      },
    ])
  }
}
