import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import Attribute from 'App/Models/product/Attribute';

export default class extends BaseSeeder {
  public async run() {
    await Attribute.createMany([
      {
        name: 'color',
      },
      {
        name: 'size',
      },
    ]);
  }
}
