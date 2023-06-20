import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import Categories from 'App/Models/product/Categories';

export default class extends BaseSeeder {
  public async run() {
    await Categories.createMany([
      {
        name: 'cloths',
      },
      {
        name: 'shoes',
      },
      {
        name: 'laptops',
      },
    ]);
  }
}
