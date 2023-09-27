import Product from 'App/Models/product/Product';
import { BaseController } from 'App/Controllers/BaseController';
import HttpCodes from 'App/Enums/HttpCodes';

export default class ProductsController extends BaseController {
  public MODEL: typeof Product;
  constructor() {
    super();
    this.MODEL = Product;
  }

  // find Product list
  public async findAllRecords({ auth, request, response }) {
    const currentUser = auth.user!;
    let DQ = this.MODEL.query();

    const page = request.input('page');
    const pageSize = request.input('pageSize');

    // name filter
    if (request.input('name')) {
      DQ = DQ.whereILike('title', request.input('name') + '%');
    }

    // fetched products with related shops
    if (!this.isSuperAdmin(currentUser)) {
      DQ = DQ.where('shop_id', currentUser.shopId!);
    }

    if (pageSize) {
      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Products find Successfully',
        result: await DQ.preload('shop')
          .preload('merchant')
          .paginate(page, pageSize),
      });
    } else {
      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Products find Successfully',
        result: await DQ.preload('shop').preload('merchant'),
      });
    }
  }

  // find Product using id
  public async findSingleRecord({ request, response }) {
    try {
      const DQ = await this.MODEL.query()
        .where('id', request.param('id'))
        .preload('shop')
        .first();

      if (!DQ) {
        return response.notFound({
          code: HttpCodes.NOT_FOUND,
          message: 'Product Data is Empty',
        });
      }

      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Product find Successfully',
        result: DQ,
      });
    } catch (e) {
      return response.internalServerError({
        code: HttpCodes.SERVER_ERROR,
        message: e.toString(),
      });
    }
  }

  // create new product
  public async create({ auth, request, response }) {
    try {
      const DE = await this.MODEL.findBy(
        'product_code',
        request.body().product_code
      );
      if (DE) {
        return response.conflict({
          code: HttpCodes.CONFLICTS,
          message: 'Product already exists!',
        });
      }
      const DM = new this.MODEL();
      DM.shopId = auth.user?.shop.id;
      DM.merchantId = request.body().merchant_id;
      DM.categoryId = request.body().category_id;
      DM.product_code = request.body().product_code;
      DM.title = request.body().title;
      DM.description = request.body().description;
      DM.status = request.body().status;
      DM.product_image = request.body().product_image;

      await DM.save();

      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Product Created Successfully!',
        result: DM,
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
  public async update({ request, response }) {
    try {
      const DQ = await this.MODEL.findBy('id', request.param('id'));

      if (!DQ) {
        return response.notFound({
          code: HttpCodes.NOT_FOUND,
          message: 'Product does not exists!',
        });
      }

      DQ.title = request.body().title;
      DQ.categoryId = request.body().category_id;
      DQ.product_code = request.body().product_code;
      DQ.description = request.body().description;
      DQ.status = request.body().status;
      DQ.product_image = request.body().product_image;

      await DQ.save();

      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Product updated successfully!',
        result: DQ,
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
  public async destroy({ request, response }) {
    const DQ = await this.MODEL.findBy('id', request.param('id'));

    if (!DQ) {
      return response.notFound({
        code: HttpCodes.NOT_FOUND,
        message: 'Product not found',
      });
    }

    await DQ.delete();
    return response.ok({
      code: HttpCodes.SUCCESS,
      result: { message: 'Product deleted successfully' },
    });
  }
}
