import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { BaseController } from 'App/Controllers/BaseController';
import HttpCodes from 'App/Enums/HttpCodes';
import Pagination from 'App/Enums/Pagination';
import Variation from 'App/Models/product/Variant';

export default class VariantsController extends BaseController {
  public MODEL: typeof Variation;
  constructor() {
    super();
    this.MODEL = Variation;
  }
  // find Variation list
  public async find({ request, response }: HttpContextContract) {
    let data = this.MODEL.query();
    if (!data) {
      return response.notFound({
        code: HttpCodes.NOT_FOUND,
        message: 'Variations Data is Empty',
      });
    }
    return response.ok({
      code: HttpCodes.SUCCESS,
      result: await data
        .preload('products')
        .preload('attributes')
        .preload('images')
        .paginate(
          request.input(Pagination.PAGE_KEY, Pagination.PAGE),
          request.input(Pagination.PER_PAGE_KEY, Pagination.PER_PAGE)
        ),
      message: 'Variation find Successfully',
    });
  }
  // find variant using id
  public async get({ request, response }: HttpContextContract) {
    try {
      const data = await this.MODEL.query()
        .where('id', request.param('id'))
        .preload('products')
        .preload('attributes')
        .preload('images')
        .first();

      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Variation find Successfully',
        result: data,
      });
    } catch (e) {
      return response.internalServerError({
        code: HttpCodes.SERVER_ERROR,
        message: e.toString(),
      });
    }
  }
  // create new variant
  public async create({ request, response }: HttpContextContract) {
    try {
      const dataExists = await this.MODEL.findBy(
        'sku_id',
        request.body().sku_id
      );
      if (dataExists) {
        return response.conflict({
          code: HttpCodes.CONFLICTS,
          message: 'Variation already exists!',
        });
      }
      const variant = new this.MODEL();
      variant.productId = request.body().product_id;
      variant.sku_id = request.body().sku_id;
      variant.attribute_value = request.body().attribute_value;
      variant.price = request.body().price;
      variant.regular_price = request.body().regular_price;
      variant.status = request.body().status;
      variant.stock_quantity = request.body().stock_quantity;
      variant.stock_status = request.body().stock_status;
      variant.rating = request.body().rating;

      await variant.save();
      // await variant.related('images').createMany(request.body().images);
      const images = request.body().images;
      for (const image of images) {
        if (image.id) {
          const existImg = await variant
            .related('images')
            .query()
            .where('id', image.id)
            .first();

          if (existImg) {
            // update image
            existImg.merge(image);
            await existImg.save();
          }
        } else {
          // Create new image
          await variant.related('images').create(image);
        }
      }

      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Variation Created Successfully!',
        result: variant,
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
      const variant = await this.MODEL.findBy('id', request.param('id'));
      if (!variant) {
        return response.notFound({
          code: HttpCodes.NOT_FOUND,
          message: 'variant does not exists!',
        });
      }
      variant.sku_id = request.body().sku_id;
      variant.attribute_value = request.body().attribute_value;
      variant.price = request.body().price;
      variant.regular_price = request.body().regular_price;
      variant.status = request.body().status;
      variant.stock_quantity = request.body().stock_quantity;
      variant.stock_status = request.body().stock_status;
      variant.rating = request.body().rating;
      await variant.save();
      const images = request.body().images;
      for (const image of images) {
        if (image.id) {
          const existImg = await variant
            .related('images')
            .query()
            .where('id', image.id)
            .first();

          if (existImg) {
            // update image
            existImg.merge(image);
            await existImg.save();
          }
        } else {
          // Create new image
          await variant.related('images').create(image);
        }
      }
      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Variant updated successfully!',
        result: variant,
      });
    } catch (e) {
      console.log(e);
      return response.internalServerError({
        code: HttpCodes.SERVER_ERROR,
        message: e.message,
      });
    }
  }

  // delete variant using id
  public async destroy({ request, response }: HttpContextContract) {
    const data = await this.MODEL.findBy('id', request.param('id'));
    if (!data) {
      return response.notFound({
        code: HttpCodes.NOT_FOUND,
        message: 'Variant not found',
      });
    }
    await data.delete();
    return response.ok({
      code: HttpCodes.SUCCESS,
      result: { message: 'Variant deleted successfully' },
    });
  }
}
