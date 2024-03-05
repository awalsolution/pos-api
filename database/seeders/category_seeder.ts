import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Category from '#models/category'

export default class extends BaseSeeder {
  async run() {
    await Category.createMany([
      {
        shopId: 1,
        name: 'cloths',
        thumbnail: '/uploads/products/h3uff8j6uzx2ebw7gn6lyqfd.jpg',
      },
      {
        shopId: 2,
        name: 'shoes',
        thumbnail: '/uploads/products/wmc37mdsz1j0rvnanvbugs1p.jpg',
      },
      {
        shopId: 3,
        name: 'laptops',
        thumbnail: '/uploads/products/c4tal7w5erf6l8zuwnlb0xj4.jp',
      },
      {
        shopId: 1,
        name: 'cloths child',
        parent_id: 1,
        thumbnail: '/uploads/products/c4tal7w5erf6l8zuwnlb0xj4.jp',
      },
      {
        shopId: 1,
        name: 'shoes child',
        parent_id: 2,
        thumbnail: '/uploads/products/c4tal7w5erf6l8zuwnlb0xj4.jp',
      },
      {
        shopId: 2,
        name: 'laptops child',
        parent_id: 3,
        thumbnail: '/uploads/products/c4tal7w5erf6l8zuwnlb0xj4.jp',
      },
    ])
  }
}
