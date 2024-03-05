import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Attribute from '#models/attribute'

export default class extends BaseSeeder {
  async run() {
    await Attribute.createMany([
      {
        shopId: 1,
        name: 'color',
      },
      {
        shopId: 1,
        name: 'size',
      },
      {
        shopId: 2,
        name: 'color',
      },
      {
        shopId: 2,
        name: 'size',
      },
      {
        shopId: 3,
        name: 'color',
      },
      {
        shopId: 3,
        name: 'size',
      },
    ])
  }
}
