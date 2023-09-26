import { BaseController } from 'App/Controllers/BaseController';
import HttpCodes from 'App/Enums/HttpCodes';
import Supplier from 'App/Models/Supplier';

export default class SupplierController extends BaseController {
  public MODEL: typeof Supplier;
  constructor() {
    super();
    this.MODEL = Supplier;
  }

  // find supplier list
  public async findAllRecords({ request, response }) {
    let DQ = this.MODEL.query();

    const page = request.input('page');
    const pageSize = request.input('pageSize');

    // name filter
    if (request.input('name')) {
      DQ = DQ.whereILike('supplier_name', request.input('name') + '%');
    }

    if (!DQ) {
      return response.notFound({
        code: HttpCodes.NOT_FOUND,
        message: 'Supplier Data is Empty',
      });
    }

    if (pageSize) {
      return response.ok({
        code: HttpCodes.SUCCESS,
        result: await DQ.preload('shop').paginate(page, pageSize),
        message: 'Supplier find Successfully',
      });
    } else {
      return response.ok({
        code: HttpCodes.SUCCESS,
        result: await DQ.preload('shop'),
        message: 'Supplier find Successfully',
      });
    }
  }

  // find supplier using id
  public async findSingleRecord({ request, response }) {
    try {
      const DQ = await this.MODEL.query()
        .where('id', request.param('id'))
        .first();

      if (!DQ) {
        return response.notFound({
          code: HttpCodes.NOT_FOUND,
          message: 'Supplier Data is Empty',
        });
      }

      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Supplier find successfully',
        result: DQ,
      });
    } catch (e) {
      return response.internalServerError({
        code: HttpCodes.SERVER_ERROR,
        message: e.toString(),
      });
    }
  }

  // create new supplier
  public async create({ request, response }) {
    try {
      const DE = await this.MODEL.findBy(
        'supplier_name',
        request.body().supplier_name
      );

      if (DE) {
        return response.conflict({
          code: HttpCodes.CONFLICTS,
          message: 'Supplier already exists!',
        });
      }
      const DM = new this.MODEL();
      DM.supplier_name = request.body().supplier_name;
      DM.supplier_phone = request.body().supplier_phone;
      DM.status = request.body().status;
      DM.address = request.body().address;
      DM.city = request.body().city;
      DM.state = request.body().state;
      DM.country = request.body().country;

      const DQ = await DM.save();
      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Supplier Created Successfully!',
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

  // update supplier using id
  public async update({ request, response }) {
    try {
      const DQ = await this.MODEL.findBy('id', request.param('id'));
      if (!DQ) {
        return response.notFound({
          code: HttpCodes.NOT_FOUND,
          message: 'Supplier does not exists!',
        });
      }
      const DE = await this.MODEL.query()
        .where('supplier_name', 'like', request.body().supplier_name)
        .whereNot('id', request.param('id'))
        .first();

      if (DE) {
        return response.conflict({
          code: HttpCodes.CONFLICTS,
          message: 'supplier_name already exists!',
        });
      }
      DQ.supplier_name = request.body().supplier_name;
      DQ.supplier_phone = request.body().supplier_phone;
      DQ.status = request.body().status;
      DQ.address = request.body().address;
      DQ.city = request.body().city;
      DQ.state = request.body().state;
      DQ.country = request.body().country;

      await DQ.save();
      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Supplier Update Successfully!',
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

  // delete supplier using id
  public async destroy({ request, response }) {
    const DQ = await this.MODEL.findBy('id', request.param('id'));
    if (!DQ) {
      return response.notFound({
        code: HttpCodes.NOT_FOUND,
        message: 'Supplier not found',
      });
    }
    await DQ.delete();
    return response.ok({
      code: HttpCodes.SUCCESS,
      message: 'Supplier deleted successfully',
    });
  }
}
