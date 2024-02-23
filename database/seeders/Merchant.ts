import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import Merchant from 'App/Models/Merchant';

export default class extends BaseSeeder {
  public async run() {
    await Merchant.createMany([
      {
        shopId: 1,
        merchant_name: 'merchant 1',
      },
      {
        shopId: 2,
        merchant_name: 'merchant 2',
      },
      {
        shopId: 3,
        merchant_name: 'merchant 3',
      },
    ]);
  }
}
