import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import Category from 'App/Models/product/Category';

export default class extends BaseSeeder {
  public async run() {
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
    ]);
  }
}
