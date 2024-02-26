import { BaseSeeder } from '@adonisjs/lucid/seeders'
import UserHasPermission from '#models/user_has_permission'

export default class extends BaseSeeder {
  async run() {
    await UserHasPermission.createMany([
      { user_id: 2, permission_id: 1 },
      { user_id: 3, permission_id: 1 },
    ])
  }
}
