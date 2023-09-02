import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Product from 'App/Models/product/Product';
import { BaseController } from 'App/Controllers/BaseController';
import HttpCodes from 'App/Enums/HttpCodes';
import Pagination from 'App/Enums/Pagination';

export default class ProductsController extends BaseController {
  public MODEL: typeof Product;
  constructor() {
    super();
    this.MODEL = Product;
  }
  // find Product list
  public async find({ auth, request, response }: HttpContextContract) {
    const user = auth.user!;
    let data = this.MODEL.query();

    // fetched products with related shops
    if (this.isVendor(user)) {
      data = data.where('shop_id', user.shopId);
    }

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

      product.title = request.body().title;
      product.categoryId = request.body().category_id;
      product.product_code = request.body().product_code;
      product.description = request.body().description;
      product.status = request.body().status;
      product.product_image = request.body().product_image;

      await product.save();

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

  // delete product using id
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
