import { BaseSeeder } from '@adonisjs/lucid/seeders'
import RoleHasPermission from '#models/role_has_permission'

export default class extends BaseSeeder {
  async run() {
    await RoleHasPermission.createMany([
      { role_id: 2, permission_id: 1 },
      { role_id: 2, permission_id: 2 },
    ])
  }
}
