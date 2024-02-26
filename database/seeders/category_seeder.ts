import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Category from '#models/category'

export default class extends BaseSeeder {
  async run() {
    await Category.createMany([
      {
        name: 'cloths',
        image: '/uploads/categories/category-01.jpeg',
      },
      {
        name: 'shoes',
        image: '/uploads/categories/category-02.png',
      },
      {
        name: 'laptops',
        image: '/uploads/categories/category-03.jpeg',
      },
      {
        name: 'cloths child',
        parent_id: 1,
        image: '/uploads/categories/category-03.jpeg',
      },
      {
        name: 'laptops child',
        parent_id: 2,
        image: '/uploads/categories/category-03.jpeg',
      },
    ])
  }
}
