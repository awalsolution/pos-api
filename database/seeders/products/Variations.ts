import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import Variation from 'App/Models/product/Variation';
export default class extends BaseSeeder {
  public async run() {
    await Variation.createMany([
      {
        productId: 1,
        attributeId: 1,
        attribute_value: 'white',
        price: 120,
        regular_price: 110,
        product_images: null,
      },
      {
        productId: 1,
        attributeId: 2,
        attribute_value: 'small',
        price: 110,
        regular_price: 100,
        product_images: null,
      },
      {
        productId: 2,
        attributeId: 1,
        attribute_value: 'white',
        price: 105,
        regular_price: 100,
        product_images: null,
      },
      {
        productId: 2,
        attributeId: 2,
        attribute_value: 'small',
        price: 100,
        regular_price: 110,
        product_images: null,
      },
    ]);
  }
}
