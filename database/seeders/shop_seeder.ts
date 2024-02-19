import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Shop from '#models/shop'

export default class extends BaseSeeder {
  async run() {
    await Shop.createMany([
      {
        shop_name: 'vendor 1',
        shop_phone: '123456784',
        address: 'DHA Phase 5',
        city: 'Lahore',
        state: 'Punjab',
        country: 'Pakistan',
        shop_logo: '/uploads/shop_logo/shop_logo.jpg',
      },
      {
        shop_name: 'vendor 2',
        shop_phone: '123456785',
        address: 'DHA Phase 5',
        city: 'Lahore',
        state: 'Punjab',
        country: 'Pakistan',
        shop_logo: '/uploads/shop_logo/shop_logo.jpg',
      },
      {
        shop_name: 'vendor 3',
        shop_phone: '123456786',
        address: 'DHA Phase 5',
        city: 'Lahore',
        state: 'Punjab',
        country: 'Pakistan',
        shop_logo: '/uploads/shop_logo/shop_logo.jpg',
      },
    ])
  }
}
