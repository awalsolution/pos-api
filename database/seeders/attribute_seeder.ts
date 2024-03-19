import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Attribute from '#models/attribute'

export default class extends BaseSeeder {
  async run() {
    await Attribute.createMany([
      {
        shopId: 1,
        productId: 1,
        name: 'color',
      },
      {
        shopId: 1,
        productId: 1,
        name: 'size',
      },
      {
        shopId: 2,
        productId: 4,
        name: 'color',
      },
      {
        shopId: 2,
        productId: 4,
        name: 'size',
      },
      {
        shopId: 3,
        productId: 8,
        name: 'color',
      },
      {
        shopId: 3,
        productId: 8,
        name: 'size',
      },
    ])
  }
}
