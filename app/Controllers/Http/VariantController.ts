import { BaseController } from 'App/Controllers/BaseController';
import HttpCodes from 'App/Enums/HttpCodes';
import Variant from 'App/Models/product/Variant';

export default class VariantController extends BaseController {
  public MODEL: typeof Variant;
  constructor() {
    super();
    this.MODEL = Variant;
  }

  /**
   * @findAllRecords
   * @paramUse(paginated)
   */
  public async findAllRecords({ request, response }) {
    let DQ = this.MODEL.query();

    const page = request.input('page');
    const perPage = request.input('perPage');

    // name filter
    if (request.input('name')) {
      DQ = DQ.whereILike('name', request.input('name') + '%');
    }

    if (!DQ) {
      return response.notFound({
        code: HttpCodes.NOT_FOUND,
        message: 'Data is Empty',
      });
    }

    if (perPage) {
      return response.ok({
        code: HttpCodes.SUCCESS,
        result: await DQ.preload('products')
          .preload('attributes')
          .preload('images')
          .paginate(page, perPage),
        message: 'Record find successfully',
      });
    } else {
      return response.ok({
        code: HttpCodes.SUCCESS,
        result: await DQ.preload('products')
          .preload('attributes')
          .preload('images'),
        message: 'Record find successfully',
      });
    }
  }

  public async findSingleRecord({ request, response }) {
    try {
      const DQ = await this.MODEL.query()
        .where('id', request.param('id'))
        .preload('products')
        .preload('attributes')
        .preload('images')
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

  public async getVariantsByProduct({ request, response }) {
    try {
      const DQ = await this.MODEL.query()
        .where('product_id', request.param('id'))
        .preload('attributes')
        .preload('images');

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
   * @requestBody <Variant>
   */
  public async create({ request, response }) {
    try {
      const DE = await this.MODEL.findBy('sku_id', request.body().sku_id);

      if (DE) {
        return response.conflict({
          code: HttpCodes.CONFLICTS,
          message: 'Record already exists!',
        });
      }

      const DM = new this.MODEL();
      DM.productId = request.param('id');
      DM.attributeId = request.body().attribute_id;
      DM.sku_id = request.body().sku_id;
      DM.attribute_value = request.body().attribute_value;
      DM.price = request.body().price;
      DM.regular_price = request.body().regular_price;
      DM.status = request.body().status;
      DM.stock_quantity = request.body().stock_quantity;
      DM.stock_status = request.body().stock_status;
      DM.rating = request.body().rating;

      await DM.save();
      const images = request.body().images;
      for (const image of images) {
        await DM.related('images').create(image);
      }

      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Record created Successfully!',
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
   * @requestBody <Variant>
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
      DQ.sku_id = request.body().sku_id;
      DQ.attribute_value = request.body().attribute_value;
      DQ.price = request.body().price;
      DQ.regular_price = request.body().regular_price;
      DQ.status = request.body().status;
      DQ.stock_quantity = request.body().stock_quantity;
      DQ.stock_status = request.body().stock_status;
      DQ.rating = request.body().rating;
      await DQ.save();
      const images = request.body().images;
      for (const image of images) {
        if (image.id) {
          const existImg = await DQ.related('images')
            .query()
            .where('id', image.id)
            .first();

          if (existImg) {
            // update image
            existImg.merge(image);
          }
        } else {
          // Create new image
          await DQ.related('images').create(image);
        }
      }
      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Record update successfully!',
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
        message: 'Record not found',
      });
    }
    await DQ.delete();
    return response.ok({
      code: HttpCodes.SUCCESS,
      message: 'Record deleted successfully',
    });
  }
}
