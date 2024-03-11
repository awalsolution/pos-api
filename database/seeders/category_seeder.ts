import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Category from '#models/category'

export default class extends BaseSeeder {
  async run() {
    await Category.createMany([
      {
        shopId: 1,
        name: 'cloths',
        thumbnail: '/uploads/products/r3os2cmjybc22ncnimqftpdb.jpg',
      },
      {
        shopId: 2,
        name: 'shoes',
        thumbnail: '/uploads/products/r3os2cmjybc22ncnimqftpdb.jpg',
      },
      {
        shopId: 3,
        name: 'laptops',
        thumbnail: '/uploads/products/r3os2cmjybc22ncnimqftpdb.jpg',
      },
      {
        shopId: 1,
        name: 'cloths child',
        parent_id: 1,
        thumbnail: '/uploads/products/r3os2cmjybc22ncnimqftpdb.jpg',
      },
      {
        shopId: 1,
        name: 'shoes child',
        parent_id: 2,
        thumbnail: '/uploads/products/r3os2cmjybc22ncnimqftpdb.jpg',
      },
      {
        shopId: 2,
        name: 'laptops child',
        parent_id: 3,
        thumbnail: '/uploads/products/r3os2cmjybc22ncnimqftpdb.jpg',
      },
    ])
  }
}
