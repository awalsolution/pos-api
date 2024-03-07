import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Variant from '#models/variant'

export default class extends BaseSeeder {
  async run() {
    await Variant.createMany([
      {
        productId: 1,
        sku: '1122',
        price: 120,
        regular_price: 110,
        stock_quantity: 2,
        stock_status: 'instock',
        thumbnail: '/uploads/products/xvlm4hapj08awmh6j8c4al7p.jpg',
      },
      {
        productId: 1,
        sku: '1133',
        price: 110,
        regular_price: 100,
        stock_quantity: 3,
        stock_status: 'instock',
        thumbnail: '/uploads/products/ru4j691autm7pu5vd09mhezb.jpg',
      },
      {
        productId: 2,
        sku: '1144',
        price: 105,
        regular_price: 100,
        stock_quantity: 2,
        stock_status: 'instock',
        thumbnail: '/uploads/products/yno2lkrg9tbuh5nz95wjkoeb.jpg',
      },
      {
        productId: 2,
        sku: '1155',
        price: 100,
        regular_price: 110,
        stock_quantity: 0,
        stock_status: 'outofstock',
        thumbnail: '/uploads/products/sbvb4sy6b57g732615bmklaa.jpg',
      },
    ])
  }
}
