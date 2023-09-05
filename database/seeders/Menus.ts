import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import Menu from 'App/Models/Menu';

export default class extends BaseSeeder {
  public async run() {
    await Menu.createMany([
      {
        menu_name: 'Dashbaord',
      },
      {
        menu_name: 'System Setting',
      },
      {
        menu_name: 'Shops',
      },
      {
        menu_name: 'Products',
      },
    ]);
  }
}
