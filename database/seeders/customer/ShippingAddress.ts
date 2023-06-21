import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import ShippingAddress from 'App/Models/customer/ShippingAddress';

export default class extends BaseSeeder {
  public async run() {
    await ShippingAddress.createMany([
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
