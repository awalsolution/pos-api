import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import BillingAddress from 'App/Models/customer/BillingAddress';

export default class extends BaseSeeder {
  public async run() {
    await BillingAddress.createMany([
      {
        customerId: 1,
        phoneNumber: '123456789',
        firstName: 'customer',
        lastName: '1',
        street: 'street 1',
        city: 'Lahore',
        state: 'Punjab',
        country: 'Pakistan',
      },
      {
        customerId: 2,
        phoneNumber: '123456789',
        firstName: 'customer',
        lastName: '2',
        street: 'street 2',
        city: 'Lahore',
        state: 'Punjab',
        country: 'Pakistan',
      },
    ]);
  }
}
