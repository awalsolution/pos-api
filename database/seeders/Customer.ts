import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import Customer from 'App/Models/customer/Customer';

export default class extends BaseSeeder {
  public async run() {
    await Customer.createMany([
      {
        shopId: 1,
        email: 'customer1@gmail.com',
        phone: '123456789',
        firstName: 'customer',
        lastName: '1',
        password: '123456',
      },
      {
        shopId: 1,
        email: 'customer2@gmail.com',
        phone: '123456789',
        firstName: 'customer',
        lastName: '2',
        password: '123456',
      },
    ]);
  }
}
