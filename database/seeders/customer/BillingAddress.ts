import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import BillingAddress from 'App/Models/customer/BillingAddress';

export default class extends BaseSeeder {
  public async run() {
    await BillingAddress.createMany([
      {
        customerId: 1,
        first_name: 'customer',
        last_name: '1',
        phone_number: '123456789',
        street: 'street 1',
        city: 'Lahore',
        state: 'Punjab',
        country: 'Pakistan',
      },
      {
        customerId: 2,
        first_name: 'customer',
        last_name: '2',
        phone_number: '123456789',
        street: 'street 2',
        city: 'Lahore',
        state: 'Punjab',
        country: 'Pakistan',
      },
    ]);
  }
}
