import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import Supplier from 'App/Models/Supplier';

export default class extends BaseSeeder {
  public async run() {
    await Supplier.createMany([
      {
        shopId: 1,
        supplier_name: 'Supplier 1',
        supplier_phone: '123456789',
        supplier_email: 'supplier1@gmail.com',
        address: 'DHA Phase 5',
        city: 'Lahore',
        state: 'Punjab',
        country: 'Pakistan',
      },
      {
        shopId: 2,
        supplier_name: 'Supplier 2',
        supplier_phone: '123456789',
        supplier_email: 'supplier2@gmail.com',
        address: 'DHA Phase 5',
        city: 'Lahore',
        state: 'Punjab',
        country: 'Pakistan',
      },
      {
        shopId: 3,
        supplier_name: 'Supplier 3',
        supplier_phone: '123456789',
        supplier_email: 'supplier3@gmail.com',
        address: 'DHA Phase 5',
        city: 'Lahore',
        state: 'Punjab',
        country: 'Pakistan',
      },
    ]);
  }
}
