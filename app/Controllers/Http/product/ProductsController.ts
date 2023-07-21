import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Product from 'App/Models/product/Product';
import { BaseController } from 'App/Controllers/BaseController';
import HttpCodes from 'App/Enums/HttpCodes';
import Pagination from 'App/Enums/Pagination';
// import Variation from 'App/Models/product/Variation';
// import VariationImage from 'App/Models/product/VariationImage';

export default class ProductsController extends BaseController {
  public MODEL: typeof Product;
  constructor() {
    super();
    this.MODEL = Product;
  }
  // find Product list
  public async find({ request, response }: HttpContextContract) {
    let data = this.MODEL.query();
    if (!data) {
      return response.notFound({
        code: HttpCodes.NOT_FOUND,
        message: 'Products Data is Empty',
      });
    }
    return response.ok({
      code: HttpCodes.SUCCESS,
      result: await data
        .preload('shop')
        .paginate(
          request.input(Pagination.PAGE_KEY, Pagination.PAGE),
          request.input(Pagination.PER_PAGE_KEY, Pagination.PER_PAGE)
        ),
      message: 'Products find Successfully',
    });
  }
  // find Product using id
  public async get({ request, response }: HttpContextContract) {
    try {
      const data = await this.MODEL.query()
        .where('id', request.param('id'))
        .preload('shop')
        .first();

      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Product find Successfully',
        result: data,
      });
    } catch (e) {
      return response.internalServerError({
        code: HttpCodes.SERVER_ERROR,
        message: e.toString(),
      });
    }
  }
  // create new product
  public async create({ auth, request, response }: HttpContextContract) {
    try {
      const dataExists = await this.MODEL.findBy(
        'product_code',
        request.body().product_code
      );
      if (dataExists) {
        return response.conflict({
          code: HttpCodes.CONFLICTS,
          message: 'Product already exists!',
        });
      }
      const product = new this.MODEL();
      product.shopId = auth.user?.shop.id;
      product.categoryId = request.body().category_id;
      product.product_code = request.body().product_code;
      product.title = request.body().title;
      product.description = request.body().description;
      product.status = request.body().status;
      product.product_image = request.body().product_image;

      await product.save();
      // await product.related('variations').createMany(request.body().variations);
      // const variation = new Variation();
      // console.log(request.body());
      // await variation
      //   .related('variation_images')
      //   .createMany(request.body().variations.variant_images);

      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Product Created Successfully!',
        result: product,
      });
    } catch (e) {
      console.log(e);
      return response.internalServerError({
        code: HttpCodes.SERVER_ERROR,
        message: e.toString(),
      });
    }
  }

  // update product using id
  public async update({ request, response }: HttpContextContract) {
    try {
      const product = await this.MODEL.findBy('id', request.param('id'));
      if (!product) {
        return response.notFound({
          code: HttpCodes.NOT_FOUND,
          message: 'Product does not exists!',
        });
      }
      // const images = new Variation();
      product.title = request.body().title;
      product.categoryId = request.body().category_id;
      product.product_code = request.body().product_code;
      product.description = request.body().description;
      product.status = request.body().status;
      product.product_image = request.body().product_image;

      await product.save();
      // console.log(request.body());
      // await product
      //   .related('variations')
      //   .updateOrCreateMany(request.body().variations);
      // await images
      //   .related('variation_images')
      //   .updateOrCreateMany(request.body().variation.variation_images);
      // for (const variation of request.body().variations) {
      //   const images = await Variation.findOrFail(variation.id);
      //   console.log(images);
      //   await images
      //     .related('variation_images')
      //     .updateOrCreateMany(variation.variation_images);
      // }
      // for (const variation of request.body().variations) {
      //   console.log(variation.variation_images);
      //   await images
      //     .related('variation_images')
      //     .updateOrCreateMany(variation.variation_images);
      // }
      // await images
      //   .related('variation_images')
      //   .updateOrCreateMany(request.body().variations.variation_images);

      // console.log(request.body());
      // const images = new Variation();
      // const variations = request.body().variations;
      // for (const variation of variations) {
      //   if (variation.id) {
      //     const existingVariation = await product
      //       .related('variations')

      //       .query()
      //       .where('id', variation.id)
      //       .first();
      //     // console.log(existingVariation);
      //     if (existingVariation) {
      //       // Update existing variation
      //       existingVariation.updateOrCreateMany(variation);
      //       await existingVariation.save();
      //       await images
      //         .related('variation_images')
      //         .updateOrCreateMany(variation.variation_images);
      //       for (const variationImg of variation.variation_images) {
      //         console.log(variationImg);
      //         images.merge({
      //           variationId: variationImg.variation_id,
      //           variant_images: variationImg.variant_images,
      //         });
      //       images.fill({
      //         variationId: variationImg.variation_id,
      //         variant_images: variationImg.variant_images,
      //       });
      //       }
      //     }
      //   } else {
      //     // Create new variation
      //     await product.related('variations').create(variation);
      //     await images
      //       .related('variation_images')
      //       .createMany(variation.variation_images);
      //   }
      // }

      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Product updated successfully!',
        result: product,
      });
    } catch (e) {
      console.log(e);
      return response.internalServerError({
        code: HttpCodes.SERVER_ERROR,
        message: e.message,
      });
    }
  }
  //update product status
  // public async updateProductStatus({ request, response }: HttpContextContract) {
  //   const data = await this.MODEL.findBy('id', request.param('id'));
  //   if (!data) {
  //     return response.notFound({
  //       code: HttpCodes.NOT_FOUND,
  //       message: 'Product not found',
  //     });
  //   }
  //   data.is_active = request.body().is_active;
  //   await data.save();
  //   return response.ok({
  //     code: HttpCodes.SUCCESS,
  //     result: { message: 'Product Status Update successfully' },
  //   });
  // }

  // delete shop using id
  public async destroy({ request, response }: HttpContextContract) {
    const data = await this.MODEL.findBy('id', request.param('id'));
    if (!data) {
      return response.notFound({
        code: HttpCodes.NOT_FOUND,
        message: 'Product not found',
      });
    }
    await data.delete();
    return response.ok({
      code: HttpCodes.SUCCESS,
      result: { message: 'Product deleted successfully' },
    });
  }
}
