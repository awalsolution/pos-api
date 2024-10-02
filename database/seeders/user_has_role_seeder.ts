import { BaseSeeder } from '@adonisjs/lucid/seeders'
import UserHasRole from '#models/user_has_role'

export default class extends BaseSeeder {
  async run() {
    await UserHasRole.createMany([{ user_id: 1, role_id: 1 }])
  }
}
