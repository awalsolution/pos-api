import { BaseSeeder } from '@adonisjs/lucid/seeders'
import VariantAttribute from '#models/variant_attribute'

export default class extends BaseSeeder {
  async run() {
    await VariantAttribute.createMany([
      {
        variantId: 1,
        attributeId: 1,
        option: 'Red',
      },
      {
        variantId: 1,
        attributeId: 1,
        option: 'Green',
      },
      {
        variantId: 1,
        attributeId: 1,
        option: 'blue',
      },
      {
        variantId: 1,
        attributeId: 2,
        option: 'L',
      },
      {
        variantId: 1,
        attributeId: 2,
        option: 'M',
      },
      {
        variantId: 1,
        attributeId: 2,
        option: 'S',
      },

      {
        variantId: 2,
        attributeId: 1,
        option: 'Red',
      },
      {
        variantId: 2,
        attributeId: 1,
        option: 'Green',
      },
      {
        variantId: 2,
        attributeId: 1,
        option: 'blue',
      },
      {
        variantId: 2,
        attributeId: 2,
        option: 'L',
      },
      {
        variantId: 2,
        attributeId: 2,
        option: 'M',
      },
      {
        variantId: 2,
        attributeId: 2,
        option: 'S',
      },
    ])
  }
}
