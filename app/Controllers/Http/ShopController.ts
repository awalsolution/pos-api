import { BaseController } from 'App/Controllers/BaseController';
import HttpCodes from 'App/Enums/HttpCodes';
import Shop from 'App/Models/Shop';

export default class ShopController extends BaseController {
  public MODEL: typeof Shop;
  constructor() {
    super();
    this.MODEL = Shop;
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
      DQ = DQ.whereILike('shop_name', request.input('name') + '%');
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
        result: await DQ.paginate(page, perPage),
        message: 'Record find Successfully',
      });
    } else {
      return response.ok({
        code: HttpCodes.SUCCESS,
        result: await DQ.select('*'),
        message: 'Record find Successfully',
      });
    }
  }

  public async findSingleRecord({ request, response }) {
    try {
      const DQ = await this.MODEL.query()
        .where('id', request.param('id'))
        .first();

      if (!DQ) {
        return response.notFound({
          code: HttpCodes.NOT_FOUND,
          message: 'Data is Empty',
        });
      }

      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Record find successfully',
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
   * @requestBody <Shop>
   */
  public async create({ request, response }) {
    try {
      const DE = await this.MODEL.findBy('shop_name', request.body().shop_name);

      if (DE) {
        return response.conflict({
          code: HttpCodes.CONFLICTS,
          message: 'Record already exists!',
        });
      }

      const DM = new this.MODEL();
      DM.shop_name = request.body().shop_name;
      DM.shop_phone = request.body().shop_phone;
      DM.status = request.body().status;
      DM.address = request.body().address;
      DM.city = request.body().city;
      DM.state = request.body().state;
      DM.country = request.body().country;
      DM.shop_logo = request.body().shop_logo;

      const DQ = await DM.save();
      return response.ok({
        code: HttpCodes.SUCCESS,
        message: ' Created Successfully!',
        result: DQ,
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
   * @requestBody <Shop>
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
      const DE = await this.MODEL.query()
        .where('shop_name', 'like', request.body().shop_name)
        .whereNot('id', request.param('id'))
        .first();

      if (DE) {
        return response.conflict({
          code: HttpCodes.CONFLICTS,
          message: 'Record already exists!',
        });
      }
      DQ.shop_name = request.body().shop_name;
      DQ.shop_phone = request.body().shop_phone;
      DQ.status = request.body().status;
      DQ.address = request.body().address;
      DQ.city = request.body().city;
      DQ.state = request.body().state;
      DQ.country = request.body().country;
      DQ.shop_logo = request.body().shop_logo;

      await DQ.save();
      return response.ok({
        code: HttpCodes.SUCCESS,
        message: ' Update Successfully!',
        result: DQ,
      });
    } catch (e) {
      console.log(e);
      return response.internalServerError({
        code: HttpCodes.SERVER_ERROR,
        message: e.toString(),
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
