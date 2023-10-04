import { BaseController } from 'App/Controllers/BaseController';
import HttpCodes from 'App/Enums/HttpCodes';
import Warehouse from 'App/Models/Warehouse';

export default class WarehouseController extends BaseController {
  public MODEL: typeof Warehouse;
  constructor() {
    super();
    this.MODEL = Warehouse;
  }

  // find warehouse list
  public async findAllRecords({ auth, request, response }) {
    let DQ = this.MODEL.query();
    const currentUser = auth.user;

    const page = request.input('page');
    const pageSize = request.input('pageSize');

    // name filter
    if (request.input('name')) {
      DQ = DQ.whereILike('warehouse_name', request.input('name') + '%');
    }

    if (!this.isSuperAdmin(currentUser)) {
      if (!this.ischeckAllSuperAdminUser(currentUser)) {
        DQ = DQ.where('shop_id', currentUser.shopId);
      }
    }

    if (!DQ) {
      return response.notFound({
        code: HttpCodes.NOT_FOUND,
        message: 'Warehouse Data is Empty',
      });
    }

    if (pageSize) {
      return response.ok({
        code: HttpCodes.SUCCESS,
        result: await DQ.preload('shop').paginate(page, pageSize),
        message: 'Warehouse find Successfully',
      });
    } else {
      return response.ok({
        code: HttpCodes.SUCCESS,
        result: await DQ.preload('shop'),
        message: 'Warehouse find Successfully',
      });
    }
  }

  // find warehouse using id
  public async findSingleRecord({ request, response }) {
    try {
      const DQ = await this.MODEL.query()
        .where('id', request.param('id'))
        .first();

      if (!DQ) {
        return response.notFound({
          code: HttpCodes.NOT_FOUND,
          message: 'Warehouse Data is Empty',
        });
      }

      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Warehouse find successfully',
        result: DQ,
      });
    } catch (e) {
      return response.internalServerError({
        code: HttpCodes.SERVER_ERROR,
        message: e.toString(),
      });
    }
  }

  // create new warehouse
  public async create({ auth, request, response }) {
    try {
      const currentUser = auth.user;

      const DE = await this.MODEL.findBy(
        'warehouse_name',
        request.body().warehouse_name
      );

      if (DE) {
        return response.conflict({
          code: HttpCodes.CONFLICTS,
          message: 'Warehouse already exists!',
        });
      }
      const DM = new this.MODEL();

      if (this.isSuperAdmin(currentUser)) {
        DM.shopId = request.body().shop_id;
      } else if (this.ischeckAllSuperAdminUser(currentUser)) {
        DM.shopId = request.body().shop_id;
      } else {
        DM.shopId = currentUser.shopId;
      }

      DM.warehouse_name = request.body().warehouse_name;
      DM.warehouse_phone = request.body().warehouse_phone;
      DM.status = request.body().status;
      DM.address = request.body().address;
      DM.city = request.body().city;
      DM.state = request.body().state;
      DM.country = request.body().country;

      const DQ = await DM.save();
      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Warehouse Created Successfully!',
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

  // update warehouse using id
  public async update({ request, response }) {
    try {
      const DQ = await this.MODEL.findBy('id', request.param('id'));
      if (!DQ) {
        return response.notFound({
          code: HttpCodes.NOT_FOUND,
          message: 'Warehouse does not exists!',
        });
      }
      const DE = await this.MODEL.query()
        .where('warehouse_name', 'like', request.body().warehouse_name)
        .whereNot('id', request.param('id'))
        .first();

      if (DE) {
        return response.conflict({
          code: HttpCodes.CONFLICTS,
          message: 'Warehouse already exists!',
        });
      }

      DQ.shopId = request.body().shop_id;
      DQ.warehouse_name = request.body().warehouse_name;
      DQ.warehouse_phone = request.body().warehouse_phone;
      DQ.status = request.body().status;
      DQ.address = request.body().address;
      DQ.city = request.body().city;
      DQ.state = request.body().state;
      DQ.country = request.body().country;

      await DQ.save();
      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Warehouse Update Successfully!',
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

  // delete warehouse using id
  public async destroy({ request, response }) {
    const DQ = await this.MODEL.findBy('id', request.param('id'));
    if (!DQ) {
      return response.notFound({
        code: HttpCodes.NOT_FOUND,
        message: 'Warehouse not found',
      });
    }
    await DQ.delete();
    return response.ok({
      code: HttpCodes.SUCCESS,
      message: 'Warehouse deleted successfully',
    });
  }
}
