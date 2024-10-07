import { BaseSeeder } from '@adonisjs/lucid/seeders'
import PlanHasPermission from '#models/plan_has_permission'

export default class extends BaseSeeder {
  async run() {
    await PlanHasPermission.createMany([
      { plan_id: 1, permission_id: 1 },
      { plan_id: 1, permission_id: 2 },
      { plan_id: 1, permission_id: 3 },
      { plan_id: 1, permission_id: 4 },
      { plan_id: 1, permission_id: 5 },
      { plan_id: 1, permission_id: 6 },
      { plan_id: 1, permission_id: 7 },
      // { plan_id: 1, permission_id: 8 },
      // { plan_id: 1, permission_id: 9 },
      // { plan_id: 1, permission_id: 10 },
      // { plan_id: 1, permission_id: 11 },
      { plan_id: 1, permission_id: 12 },
      // { plan_id: 1, permission_id: 13 },
      // { plan_id: 1, permission_id: 14 },
      // { plan_id: 1, permission_id: 15 },
      // { plan_id: 1, permission_id: 16 },
      { plan_id: 1, permission_id: 17 },
      { plan_id: 1, permission_id: 18 },
      // { plan_id: 1, permission_id: 19 },
      // { plan_id: 1, permission_id: 20 },
      // { plan_id: 1, permission_id: 21 },
      { plan_id: 1, permission_id: 22 },
      { plan_id: 1, permission_id: 23 },
      { plan_id: 1, permission_id: 24 },
      { plan_id: 1, permission_id: 25 },
      { plan_id: 1, permission_id: 26 },
      { plan_id: 1, permission_id: 27 },
      { plan_id: 1, permission_id: 28 },
      { plan_id: 1, permission_id: 29 },
      { plan_id: 1, permission_id: 30 },
      { plan_id: 1, permission_id: 31 },
      { plan_id: 1, permission_id: 32 },
    ])
  }
}
