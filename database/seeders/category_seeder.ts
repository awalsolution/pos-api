import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Category from '#models/category'

export default class extends BaseSeeder {
  async run() {
    await Category.createMany([
      {
        shopId: 1,
        name: 'cloths',
        image: '/uploads/categories/category-01.jpeg',
      },
      {
        shopId: 2,
        name: 'shoes',
        image: '/uploads/categories/category-02.png',
      },
      {
        shopId: 3,
        name: 'laptops',
        image: '/uploads/categories/category-03.jpeg',
      },
      {
        shopId: 1,
        name: 'cloths child',
        parent_id: 1,
        image: '/uploads/categories/category-03.jpeg',
      },
      {
        shopId: 2,
        name: 'laptops child',
        parent_id: 2,
        image: '/uploads/categories/category-03.jpeg',
      },
    ])
  }
}
