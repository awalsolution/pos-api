import { BaseSeeder } from '@adonisjs/lucid/seeders'
import UserHasRole from '#models/user_has_role'

export default class extends BaseSeeder {
  async run() {
    await UserHasRole.createMany([
      { user_id: 2, role_id: 2 },
      { user_id: 3, role_id: 3 },
    ])
  }
}
