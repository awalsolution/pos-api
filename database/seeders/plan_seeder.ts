import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Plan from '#models/plan'

export default class extends BaseSeeder {
  async run() {
    await Plan.createMany([
      {
        name: 'free',
        type: 'Month',
        price: '0',
        description: 'This is free plan',
        status: true,
        created_by: 'Iqbal Hassan',
      },
    ])
  }
}
