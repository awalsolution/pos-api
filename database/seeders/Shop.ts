import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import Shop from 'App/Models/Shop';

export default class extends BaseSeeder {
  public async run() {
    await Shop.createMany([
      {
        userId: 1,
        shop_name: 'owner shop',
        shop_phone: '123456789',
        address: 'DHA Phase 5',
        city: 'Lahore',
        state: 'Punjab',
        country: 'Pakistan',
        shop_logo: null,
      },
      {
        userId: 2,
        shop_name: 'admin shop',
        shop_phone: '123456789',
        address: 'DHA Phase 5',
        city: 'Lahore',
        state: 'Punjab',
        country: 'Pakistan',
        shop_logo: null,
      },
      {
        userId: 3,
        shop_name: 'vendor shop',
        shop_phone: '123456789',
        address: 'DHA Phase 5',
        city: 'Lahore',
        state: 'Punjab',
        country: 'Pakistan',
        shop_logo: null,
      },
    ]);
  }
}
