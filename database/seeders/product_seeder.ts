import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Product from '#models/product'

export default class extends BaseSeeder {
  async run() {
    await Product.createMany([
      {
        shopId: 1,
        name: 'Product 01',
        // slug: 'product-01',
        description: 'this is shop 01 product 01 long description',
        thumbnail: '/uploads/products/ju1vtyrxr6ixga87oparo7rm.jpg',
      },
      {
        shopId: 1,
        name: 'Product 02',
        // slug: 'product-02',
        description: 'this is shop 01 product 02 long description',
        thumbnail: '/uploads/products/ju1vtyrxr6ixga87oparo7rm.jpg',
      },
      {
        shopId: 1,
        name: 'Product 03',
        // slug: 'product-03',
        description: 'this is shop 01 product 03 long description',
        thumbnail: '/uploads/products/ju1vtyrxr6ixga87oparo7rm.jpg',
      },
      {
        shopId: 2,
        name: 'Product 01',
        // slug: 'product-01',
        description: 'this is shop 02 product 01 long description',
        thumbnail: '/uploads/products/ju1vtyrxr6ixga87oparo7rm.jpg',
      },
      {
        shopId: 2,
        name: 'Product 02',
        // slug: 'product-02',
        description: 'this is shop 02 product 02 long description',
        thumbnail: '/uploads/products/ju1vtyrxr6ixga87oparo7rm.jpg',
      },
      {
        shopId: 2,
        name: 'Product 03',
        // slug: 'product-03',
        description: 'this is shop 02 product 03 long description',
        thumbnail: '/uploads/products/ju1vtyrxr6ixga87oparo7rm.jpg',
      },
      {
        shopId: 3,
        name: 'Product 01',
        // slug: 'product-01',
        description: 'this is shop 03 product 01 long description',
        thumbnail: '/uploads/products/ju1vtyrxr6ixga87oparo7rm.jpg',
      },
      {
        shopId: 3,
        name: 'Product 02',
        // slug: 'product-02',
        description: 'this is shop 02 product 02 long description',
        thumbnail: '/uploads/products/ju1vtyrxr6ixga87oparo7rm.jpg',
      },
      {
        shopId: 3,
        name: 'Product 03',
        // slug: 'product-03',
        description: 'this is shop 02 product 03 long description',
        thumbnail: '/uploads/products/ju1vtyrxr6ixga87oparo7rm.jpg',
      },
    ])
  }
}
