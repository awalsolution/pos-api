import { BaseSeeder } from '@adonisjs/lucid/seeders'
import VariantImage from '#models/variant_image'

export default class extends BaseSeeder {
  async run() {
    await VariantImage.createMany([
      {
        variantId: 1,
        url: '/uploads/products/r3os2cmjybc22ncnimqftpdb.jpg',
      },
      {
        variantId: 1,
        url: '/uploads/products/arlxpp9r6dyivhnhfarq3ttz.jpg',
      },
      {
        variantId: 1,
        url: '/uploads/products/u0ttkloy9wkfxp5fbt259kjn.jpg',
      },
      {
        variantId: 1,
        url: '/uploads/products/ydi0wdaon9cuhfcidsw14p1w.jpg',
      },
      {
        variantId: 2,
        url: '/uploads/products/r3os2cmjybc22ncnimqftpdb.jpg',
      },
      {
        variantId: 2,
        url: '/uploads/products/arlxpp9r6dyivhnhfarq3ttz.jpg',
      },
      {
        variantId: 2,
        url: '/uploads/products/u0ttkloy9wkfxp5fbt259kjn.jpg',
      },
      {
        variantId: 2,
        url: '/uploads/products/ydi0wdaon9cuhfcidsw14p1w.jpg',
      },
      {
        variantId: 3,
        url: '/uploads/products/r3os2cmjybc22ncnimqftpdb.jpg',
      },
      {
        variantId: 3,
        url: '/uploads/products/arlxpp9r6dyivhnhfarq3ttz.jpg',
      },
      {
        variantId: 3,
        url: '/uploads/products/u0ttkloy9wkfxp5fbt259kjn.jpg',
      },
      {
        variantId: 3,
        url: '/uploads/products/ydi0wdaon9cuhfcidsw14p1w.jpg',
      },
      {
        variantId: 4,
        url: '/uploads/products/r3os2cmjybc22ncnimqftpdb.jpg',
      },
      {
        variantId: 4,
        url: '/uploads/products/arlxpp9r6dyivhnhfarq3ttz.jpg',
      },
      {
        variantId: 4,
        url: '/uploads/products/u0ttkloy9wkfxp5fbt259kjn.jpg',
      },
      {
        variantId: 4,
        url: '/uploads/products/ydi0wdaon9cuhfcidsw14p1w.jpg',
      },
    ])
  }
}
