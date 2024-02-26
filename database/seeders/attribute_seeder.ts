import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Attribute from '#models/attribute'

export default class extends BaseSeeder {
  async run() {
    await Attribute.createMany([
      {
        name: 'color',
      },
      {
        name: 'size',
      },
    ])
  }
}
