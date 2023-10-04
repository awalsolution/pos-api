import { BaseController } from 'App/Controllers/BaseController';
import HttpCodes from 'App/Enums/HttpCodes';
import PurchaseOrder from 'App/Models/PurchaseOrder';

export default class PurchaseController extends BaseController {
  public MODEL: typeof PurchaseOrder;
  constructor() {
    super();
    this.MODEL = PurchaseOrder;
  }

  // find purchase list
  public async findAllRecords({ auth, request, response }) {
    let DQ = this.MODEL.query();
    const currentUser = auth.user;

    const page = request.input('page');
    const pageSize = request.input('pageSize');

    // name filter
    if (request.input('name')) {
      DQ = DQ.whereILike('merchant_name', request.input('name') + '%');
    }

    if (!this.isSuperAdmin(currentUser)) {
      if (!this.ischeckAllSuperAdminUser(currentUser)) {
        DQ = DQ.where('shop_id', currentUser.shopId!);
      }
    }

    if (!DQ) {
      return response.notFound({
        code: HttpCodes.NOT_FOUND,
        message: 'Purchase Data is Empty',
      });
    }

    if (pageSize) {
      return response.ok({
        code: HttpCodes.SUCCESS,
        result: await DQ.preload('shop')
          .preload('merchant')
          .preload('supplier')
          .preload('warehouse')
          .preload('user', (q) => q.preload('profile'))
          .paginate(page, pageSize),
        message: 'Purchase find Successfully',
      });
    } else {
      return response.ok({
        code: HttpCodes.SUCCESS,
        result: await DQ.preload('shop'),
        message: 'Purchase find Successfully',
      });
    }
  }

  // find purchase using id
  public async findSingleRecord({ request, response }) {
    try {
      const DQ = await this.MODEL.query()
        .where('id', request.param('id'))
        .first();

      if (!DQ) {
        return response.notFound({
          code: HttpCodes.NOT_FOUND,
          message: 'Purchase Data is Empty',
        });
      }

      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Purchase find successfully',
        result: DQ,
      });
    } catch (e) {
      return response.internalServerError({
        code: HttpCodes.SERVER_ERROR,
        message: e.toString(),
      });
    }
  }

  // create new purchase
  public async create({ auth, request, response }) {
    try {
      const currentUser = auth.user;
      const DM = new this.MODEL();

      if (this.isSuperAdmin(currentUser)) {
        DM.shopId = request.body().shop_id;
        DM.userId = currentUser.id;
      } else if (this.ischeckAllSuperAdminUser(currentUser)) {
        DM.shopId = request.body().shop_id;
        DM.userId = currentUser.id;
      } else {
        DM.shopId = currentUser.shopId;
        DM.userId = currentUser.id;
      }

      DM.warehouseId = request.body().warehouse_id;
      DM.merchantId = request.body().merchant_id;
      DM.supplierId = request.body().supplier_id;
      DM.status = request.body().status;
      DM.expected_date = request.body().expected_date;
      DM.order_type = request.body().order_type;
      DM.notes = request.body().notes;

      const DQ = await DM.save();
      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Purchase Created Successfully!',
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

  // update purchase using id
  public async update({ auth, request, response }) {
    try {
      const currentUser = auth.user;
      const DQ = await this.MODEL.findBy('id', request.param('id'));
      if (!DQ) {
        return response.notFound({
          code: HttpCodes.NOT_FOUND,
          message: 'Purchase does not exists!',
        });
      }

      DQ.userId = currentUser.id;
      DQ.warehouseId = request.body().warehouse_id;
      DQ.merchantId = request.body().merchant_id;
      DQ.supplierId = request.body().supplier_id;
      DQ.status = request.body().status;
      DQ.expected_date = request.body().expected_date;
      DQ.order_type = request.body().order_type;
      DQ.notes = request.body().notes;

      await DQ.save();
      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Purchase Update Successfully!',
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

  // delete purchase using id
  public async destroy({ request, response }) {
    const DQ = await this.MODEL.findBy('id', request.param('id'));
    if (!DQ) {
      return response.notFound({
        code: HttpCodes.NOT_FOUND,
        message: 'Purchase not found',
      });
    }
    await DQ.delete();
    return response.ok({
      code: HttpCodes.SUCCESS,
      message: 'Purchase deleted successfully',
    });
  }
}
