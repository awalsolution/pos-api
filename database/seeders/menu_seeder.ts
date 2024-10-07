import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Menu from '#models/menu'

export default class extends BaseSeeder {
  async run() {
    await Menu.createMany([
      {
        name: 'Dashboard',
        type: 'public',
        status: 1,
        created_by: 'Iqbal Hassan',
      },
      {
        name: 'Menu',
        type: 'public',
        status: 1,
        created_by: 'Iqbal Hassan',
      },
      {
        name: 'Tenants',
        type: 'private',
        status: 1,
        created_by: 'Iqbal Hassan',
      },
      {
        name: 'Plans',
        type: 'private',
        status: 1,
        created_by: 'Iqbal Hassan',
      },
      {
        name: 'Permissions',
        type: 'public',
        status: 1,
        created_by: 'Iqbal Hassan',
      },
      {
        name: 'Users',
        type: 'public',
        status: 1,
        created_by: 'Iqbal Hassan',
      },
      {
        name: 'Roles',
        type: 'public',
        status: 1,
        created_by: 'Iqbal Hassan',
      },
    ])
  }
}
