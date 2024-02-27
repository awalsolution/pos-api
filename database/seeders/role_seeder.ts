import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Role from '#models/role'

export default class extends BaseSeeder {
  async run() {
    await Role.createMany([
      {
        name: 'super admin',
      },
      {
        name: 'shop admin',
      },
      {
        name: 'admin',
      },
      {
        name: 'manager',
      },
      {
        name: 'admin',
        shopId: 1,
      },
      {
        name: 'manager',
        shopId: 1,
      },
      {
        name: 'admin',
        shopId: 2,
      },
      {
        name: 'manager',
        shopId: 2,
      },
      {
        name: 'admin',
        shopId: 3,
      },
      {
        name: 'manager',
        shopId: 3,
      },
    ])
  }
}
