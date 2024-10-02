import { BaseSeeder } from '@adonisjs/lucid/seeders'
import UserHasPermission from '#models/user_has_permission'

export default class extends BaseSeeder {
  async run() {
    await UserHasPermission.createMany([{ user_id: 1, permission_id: 1 }])
  }
}
