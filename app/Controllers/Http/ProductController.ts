import Product from 'App/Models/product/Product';
import { BaseController } from 'App/Controllers/BaseController';
import HttpCodes from 'App/Enums/HttpCodes';

export default class ProductController extends BaseController {
  public MODEL: typeof Product;
  constructor() {
    super();
    this.MODEL = Product;
  }

  /**
   * @findAllRecords
   * @paramUse(paginated)
   */
  public async findAllRecords({ auth, request, response }) {
    const currentUser = auth.user!;
    let DQ = this.MODEL.query();

    const page = request.input('page');
    const perPage = request.input('perPage');

    // name filter
    if (request.input('name')) {
      DQ = DQ.whereILike('title', request.input('name') + '%');
    }

    // fetched products with related shops
    if (!this.isSuperAdmin(currentUser)) {
      DQ = DQ.where('shop_id', currentUser.shopId!);
    }

    if (perPage) {
      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Record find Successfully',
        result: await DQ.preload('shop').paginate(page, perPage),
      });
    } else {
      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Record find Successfully',
        result: await DQ.preload('shop'),
      });
    }
  }

  public async findSingleRecord({ request, response }) {
    try {
      const DQ = await this.MODEL.query()
        .where('id', request.param('id'))
        .preload('shop')
        .first();

      if (!DQ) {
        return response.notFound({
          code: HttpCodes.NOT_FOUND,
          message: 'Data is Empty',
        });
      }

      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Record find Successfully',
        result: DQ,
      });
    } catch (e) {
      return response.internalServerError({
        code: HttpCodes.SERVER_ERROR,
        message: e.toString(),
      });
    }
  }

  /**
   * @create
   * @requestBody <Product>
   */
  public async create({ auth, request, response }) {
    try {
      const DE = await this.MODEL.findBy(
        'product_code',
        request.body().product_code
      );
      if (DE) {
        return response.conflict({
          code: HttpCodes.CONFLICTS,
          message: 'Record already exists!',
        });
      }
      const DM = new this.MODEL();
      DM.shopId = auth.user?.shop.id;
      DM.categoryId = request.body().category_id;
      DM.product_code = request.body().product_code;
      DM.title = request.body().title;
      DM.description = request.body().description;
      DM.status = request.body().status;
      DM.product_image = request.body().product_image;

      await DM.save();

      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Created Successfully!',
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

  /**
   * @update
   * @requestBody <Product>
   */
  public async update({ request, response }) {
    try {
      const DQ = await this.MODEL.findBy('id', request.param('id'));

      if (!DQ) {
        return response.notFound({
          code: HttpCodes.NOT_FOUND,
          message: 'Data does not exists!',
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
        message: 'Updated Successfully!',
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

  public async destroy({ request, response }) {
    const DQ = await this.MODEL.findBy('id', request.param('id'));

    if (!DQ) {
      return response.notFound({
        code: HttpCodes.NOT_FOUND,
        message: 'Data not found',
      });
    }

    await DQ.delete();
    return response.ok({
      code: HttpCodes.SUCCESS,
      message: 'Record deleted successfully',
    });
  }
}
