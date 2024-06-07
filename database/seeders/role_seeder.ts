import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Role from '#models/role'

export default class extends BaseSeeder {
  async run() {
    await Role.createMany([
      {
        name: 'super admin',
      },
      {
        name: 'company admin',
      },
    ])
  }
}
