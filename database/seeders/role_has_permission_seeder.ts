import { BaseSeeder } from '@adonisjs/lucid/seeders'
import RoleHasPermission from '#models/role_has_permission'

export default class extends BaseSeeder {
  async run() {
    await RoleHasPermission.createMany([
      { role_id: 2, permission_id: 1 },
      { role_id: 2, permission_id: 2 },
      { role_id: 2, permission_id: 3 },
      { role_id: 2, permission_id: 4 },
      { role_id: 2, permission_id: 5 },
      { role_id: 2, permission_id: 6 },
      { role_id: 2, permission_id: 7 },
      { role_id: 2, permission_id: 8 },
      { role_id: 2, permission_id: 9 },
      { role_id: 2, permission_id: 10 },
      { role_id: 2, permission_id: 11 },
      { role_id: 2, permission_id: 12 },
      { role_id: 2, permission_id: 13 },
      { role_id: 2, permission_id: 14 },
      { role_id: 2, permission_id: 15 },
      { role_id: 2, permission_id: 20 },
      { role_id: 2, permission_id: 30 },
      { role_id: 2, permission_id: 31 },
      { role_id: 2, permission_id: 32 },
      { role_id: 2, permission_id: 33 },
      { role_id: 2, permission_id: 34 },
      { role_id: 2, permission_id: 35 },
      { role_id: 2, permission_id: 36 },
      { role_id: 2, permission_id: 37 },
      { role_id: 2, permission_id: 38 },
      { role_id: 2, permission_id: 39 },
      { role_id: 2, permission_id: 40 },
      { role_id: 2, permission_id: 41 },
      { role_id: 2, permission_id: 42 },
      { role_id: 2, permission_id: 43 },
      { role_id: 2, permission_id: 44 },
      { role_id: 2, permission_id: 45 },
      { role_id: 2, permission_id: 46 },
    ])
  }
}
