import { BaseController } from 'App/Controllers/BaseController';
import HttpCodes from 'App/Enums/HttpCodes';
import Merchant from 'App/Models/Merchant';

export default class MerchantController extends BaseController {
  public MODEL: typeof Merchant;
  constructor() {
    super();
    this.MODEL = Merchant;
  }

  // find merchant list
  public async findAllRecords({ request, response }) {
    let DQ = this.MODEL.query();

    const page = request.input('page');
    const pageSize = request.input('pageSize');

    // name filter
    if (request.input('name')) {
      DQ = DQ.whereILike('merchant_name', request.input('name') + '%');
    }

    if (!DQ) {
      return response.notFound({
        code: HttpCodes.NOT_FOUND,
        message: 'Merchant Data is Empty',
      });
    }

    if (pageSize) {
      return response.ok({
        code: HttpCodes.SUCCESS,
        result: await DQ.preload('shop').paginate(page, pageSize),
        message: 'Merchants find Successfully',
      });
    } else {
      return response.ok({
        code: HttpCodes.SUCCESS,
        result: await DQ.preload('shop'),
        message: 'Merchants find Successfully',
      });
    }
  }

  // find merchant using id
  public async findSingleRecord({ request, response }) {
    try {
      const DQ = await this.MODEL.query()
        .where('id', request.param('id'))
        .first();

      if (!DQ) {
        return response.notFound({
          code: HttpCodes.NOT_FOUND,
          message: 'Merchant Data is Empty',
        });
      }

      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Merchant find successfully',
        result: DQ,
      });
    } catch (e) {
      return response.internalServerError({
        code: HttpCodes.SERVER_ERROR,
        message: e.toString(),
      });
    }
  }

  // create new merchant
  public async create({ auth, request, response }) {
    try {
      const currentUser = auth.user;

      const DE = await this.MODEL.findBy(
        'merchant_name',
        request.body().merchant_name
      );

      if (DE) {
        return response.conflict({
          code: HttpCodes.CONFLICTS,
          message: 'Merchant already exists!',
        });
      }
      const DM = new this.MODEL();

      if (this.isSuperAdmin(currentUser)) {
        DM.shopId = request.body().shop_id;
      } else {
        DM.shopId = currentUser.shopId;
      }

      DM.merchant_name = request.body().merchant_name;
      DM.status = request.body().status;

      const DQ = await DM.save();
      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Merchant Created Successfully!',
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

  // update merchant using id
  public async update({ request, response }) {
    try {
      const DQ = await this.MODEL.findBy('id', request.param('id'));
      if (!DQ) {
        return response.notFound({
          code: HttpCodes.NOT_FOUND,
          message: 'Merchant does not exists!',
        });
      }
      const DE = await this.MODEL.query()
        .where('merchant_name', 'like', request.body().merchant_name)
        .whereNot('id', request.param('id'))
        .first();

      if (DE) {
        return response.conflict({
          code: HttpCodes.CONFLICTS,
          message: 'Merchant already exists!',
        });
      }

      DQ.merchant_name = request.body().merchant_name;
      DQ.status = request.body().status;

      await DQ.save();
      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Merchant Update Successfully!',
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

  // delete merchant using id
  public async destroy({ request, response }) {
    const DQ = await this.MODEL.findBy('id', request.param('id'));
    if (!DQ) {
      return response.notFound({
        code: HttpCodes.NOT_FOUND,
        message: 'Merchant not found',
      });
    }
    await DQ.delete();
    return response.ok({
      code: HttpCodes.SUCCESS,
      message: 'Merchant deleted successfully',
    });
  }
}
