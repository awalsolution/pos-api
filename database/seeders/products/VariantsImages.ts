import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import VariantImage from 'App/Models/product/VariantImage';
export default class extends BaseSeeder {
  public async run() {
    await VariantImage.createMany([
      {
        variantId: 1,
        images: '/uploads/products/product-01.png',
      },
      {
        variantId: 1,
        images: '/uploads/products/product-02.png',
      },
      {
        variantId: 1,
        images: '/uploads/products/product-03.png',
      },
      {
        variantId: 1,
        images: '/uploads/products/product-04.png',
      },
      {
        variantId: 2,
        images: '/uploads/products/product-01.png',
      },
      {
        variantId: 2,
        images: '/uploads/products/product-02.png',
      },
      {
        variantId: 2,
        images: '/uploads/products/product-03.png',
      },
      {
        variantId: 2,
        images: '/uploads/products/product-04.png',
      },
      {
        variantId: 3,
        images: '/uploads/products/product-01.png',
      },
      {
        variantId: 3,
        images: '/uploads/products/product-02.png',
      },
      {
        variantId: 3,
        images: '/uploads/products/product-03.png',
      },
      {
        variantId: 3,
        images: '/uploads/products/product-04.png',
      },
      {
        variantId: 4,
        images: '/uploads/products/product-01.png',
      },
      {
        variantId: 4,
        images: '/uploads/products/product-02.png',
      },
      {
        variantId: 4,
        images: '/uploads/products/product-03.png',
      },
      {
        variantId: 4,
        images: '/uploads/products/product-04.png',
      },
    ]);
  }
}
