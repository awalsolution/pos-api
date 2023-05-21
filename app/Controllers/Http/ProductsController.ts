import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Product from 'App/Models/Product';
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
  public async find({ request, response }: HttpContextContract) {
    let data = this.MODEL.query();
    if (!data) {
      return response.status(HttpCodes.NOT_FOUND).send({
        code: HttpCodes.NOT_FOUND,
        message: 'Products Data is Empty',
      });
    }
    return response.status(HttpCodes.SUCCESS).send({
      code: HttpCodes.SUCCESS,
      result: await data.paginate(
        request.input(Pagination.PAGE_KEY, Pagination.PAGE),
        request.input(Pagination.PER_PAGE_KEY, Pagination.PER_PAGE)
      ),
      message: 'Products find Successfully',
    });
  }
  // find Product using id
  public async get({ request, response }: HttpContextContract) {
    try {
      const data = await this.MODEL.query().where('id', request.param('id'));

      return response.status(HttpCodes.SUCCESS).send({
        code: HttpCodes.SUCCESS,
        message: 'Product find Successfully',
        result: data,
      });
    } catch (e) {
      return response
        .status(HttpCodes.SERVER_ERROR)
        .send({ code: HttpCodes.SERVER_ERROR, message: e.toString() });
    }
  }
  // create new product
  public async create({ auth, request, response }: HttpContextContract) {
    try {
      const dataExists = await this.MODEL.findBy(
        'product_sku',
        request.body().product_sku
      );
      if (dataExists) {
        return response
          .status(HttpCodes.CONFLICTS)
          .send({ message: 'Product already exists!' });
      }
      const product = new this.MODEL();
      product.shopId = auth.user?.shop.id;
      product.product_sku = request.body().product_sku;
      product.title = request.body().title;
      product.slug = request.body().slug;
      product.price = request.body().price;
      product.sale_price = request.body().sale_price;
      product.description = request.body().description;
      product.short_description = request.body().short_description;
      product.product_images = request.body().product_images;

      const data = await product.save();
      return response.status(HttpCodes.SUCCESS).send({
        code: HttpCodes.SUCCESS,
        message: 'Product Created Successfully!',
        result: data,
      });
    } catch (e) {
      console.log(e);
      return response
        .status(HttpCodes.SERVER_ERROR)
        .send({ code: HttpCodes.SERVER_ERROR, message: e.toString() });
    }
  }

  // update Role using id
  public async update({ request, response }: HttpContextContract) {
    try {
      const product = await this.MODEL.findBy('id', request.param('id'));
      if (!product) {
        return response.status(HttpCodes.NOT_FOUND).send({
          code: HttpCodes.NOT_FOUND,
          message: 'Product does not exists!',
        });
      }
      const productTypeExist = await this.MODEL.query()
        .where('name', 'like', request.body().name)
        .whereNot('id', request.param('id'))
        .first();
      if (productTypeExist) {
        return response.status(HttpCodes.CONFLICTS).send({
          code: HttpCodes.CONFLICTS,
          message: `${request.body().name} Product type already exist!`,
        });
      }
      product.product_sku = request.body().product_sku;
      product.title = request.body().title;
      product.slug = request.body().slug;
      product.price = request.body().price;
      product.sale_price = request.body().sale_price;
      product.description = request.body().description;
      product.short_description = request.body().short_description;
      product.product_images = request.body().product_images;

      await product.save();
      return response.status(HttpCodes.SUCCESS).send({
        code: HttpCodes.SUCCESS,
        message: 'Product updated Successfully!',
        result: product,
      });
    } catch (e) {
      console.log(e);
      return response
        .status(HttpCodes.SERVER_ERROR)
        .send({ code: HttpCodes.SERVER_ERROR, message: e.message });
    }
  }
  //update product status
  public async updateProductStatus({ request, response }: HttpContextContract) {
    const data = await this.MODEL.findBy('id', request.param('id'));
    if (!data) {
      return response.status(HttpCodes.NOT_FOUND).send({
        code: HttpCodes.NOT_FOUND,
        message: 'Product not found',
      });
    }
    data.is_active = request.body().is_active;
    await data.save();
    return response.status(HttpCodes.SUCCESS).send({
      code: HttpCodes.SUCCESS,
      result: { message: 'Product Status Update successfully' },
    });
  }

  // delete shop using id
  public async destroy({ request, response }: HttpContextContract) {
    const data = await this.MODEL.findBy('id', request.param('id'));
    if (!data) {
      return response.status(HttpCodes.NOT_FOUND).send({
        code: HttpCodes.NOT_FOUND,
        message: 'Product not found',
      });
    }
    await data.delete();
    return response.status(HttpCodes.SUCCESS).send({
      code: HttpCodes.SUCCESS,
      result: { message: 'Product deleted successfully' },
    });
  }
}
