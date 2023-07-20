import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import Variation from 'App/Models/product/Variation';
export default class extends BaseSeeder {
  public async run() {
    await Variation.createMany([
      {
        productId: 1,
        attributeId: 1,
        sku_id: '1122',
        attribute_value: 'white',
        price: 120,
        regular_price: 110,
        stock_quantity: 2,
        stock_status: 'instock',
        rating: 5,
      },
      {
        productId: 1,
        attributeId: 2,
        sku_id: '1133',
        attribute_value: 'small',
        price: 110,
        regular_price: 100,
        stock_quantity: 3,
        stock_status: 'instock',
        rating: 10,
      },
      {
        productId: 2,
        attributeId: 1,
        sku_id: '1144',
        attribute_value: 'white',
        price: 105,
        regular_price: 100,
        stock_quantity: 2,
        stock_status: 'instock',
        rating: 4,
      },
      {
        productId: 2,
        attributeId: 2,
        sku_id: '1155',
        attribute_value: 'small',
        price: 100,
        regular_price: 110,
        stock_quantity: 1,
        stock_status: 'outofstock',
        rating: 6,
      },
    ]);
  }
}
