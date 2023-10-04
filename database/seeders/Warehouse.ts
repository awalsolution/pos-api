import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import Warehouse from 'App/Models/Warehouse';

export default class extends BaseSeeder {
  public async run() {
    await Warehouse.createMany([
      {
        shopId: 1,
        warehouse_name: 'warehouse1 shop1',
        warehouse_phone: '123456789',
        warehouse_address: 'Phase 5',
        warehouse_city: 'Lahore',
        warehouse_state: 'Punjab',
        warehouse_country: 'Pakistan',
      },
      {
        shopId: 1,
        warehouse_name: 'warehouse2 shop1',
        warehouse_phone: '123456789',
        status: 'disabled',
        warehouse_address: 'Phase 5',
        warehouse_city: 'Lahore',
        warehouse_state: 'Punjab',
        warehouse_country: 'Pakistan',
      },
      {
        shopId: 2,
        warehouse_name: 'warehouse1 shop2',
        warehouse_phone: '123456789',
        warehouse_address: 'Phase 5',
        warehouse_city: 'Lahore',
        warehouse_state: 'Punjab',
        warehouse_country: 'Pakistan',
      },
      {
        shopId: 2,
        warehouse_name: 'warehouse2 shop2',
        warehouse_phone: '123456789',
        warehouse_address: 'Phase 5',
        warehouse_city: 'Lahore',
        warehouse_state: 'Punjab',
        warehouse_country: 'Pakistan',
      },
      {
        shopId: 3,
        warehouse_name: 'warehouse1 shop3',
        warehouse_phone: '123456789',
        warehouse_address: 'Phase 5',
        warehouse_city: 'Lahore',
        warehouse_state: 'Punjab',
        warehouse_country: 'Pakistan',
      },
      {
        shopId: 3,
        warehouse_name: 'warehouse2 shop3',
        warehouse_phone: '123456789',
        status: 'disabled',
        warehouse_address: 'Phase 5',
        warehouse_city: 'Lahore',
        warehouse_state: 'Punjab',
        warehouse_country: 'Pakistan',
      },
    ]);
  }
}
