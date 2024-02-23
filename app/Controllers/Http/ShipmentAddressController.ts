import { BaseController } from 'App/Controllers/BaseController';
import HttpCodes from 'App/Enums/HttpCodes';
import ShipmentAddress from 'App/Models/ShipmentAddress';

export default class ShipmentAddressController extends BaseController {
  declare MODEL: typeof ShipmentAddress;
  constructor() {
    super();
    this.MODEL = ShipmentAddress;
  }

  // /**
  //  * @findAllRecords
  //  * @paramUse(paginated)
  //  */
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
        message: 'Record find Successfully',
        result: await DQ.paginate(page, perPage),
      });
    } else {
      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Record find Successfully',
        result: await DQ.select('*'),
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

  // /**
  //  * @create
  //  * @requestBody <ShipmentAddress>
  //  */
  public async create({ request, response }) {
    try {
      const DM = new this.MODEL();

      DM.type = request.body().type;
      DM.first_name = request.body().first_name;
      DM.last_name = request.body().last_name;
      DM.phone_number = request.body().phone_number;
      DM.address = request.body().address;
      DM.city = request.body().city;
      DM.state = request.body().state;
      DM.country = request.body().country;

      const DQ = await DM.save();
      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Created Successfully!',
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

  // /**
  //  * @update
  //  * @requestBody <ShipmentAddress>
  //  */
  public async update({ request, response }) {
    try {
      const DQ = await this.MODEL.findBy('id', request.param('id'));

      if (!DQ) {
        return response.notFound({
          code: HttpCodes.NOT_FOUND,
          message: 'Record does not exists!',
        });
      }

      DQ.type = request.body().type;
      DQ.first_name = request.body().first_name;
      DQ.last_name = request.body().last_name;
      DQ.phone_number = request.body().phone_number;
      DQ.address = request.body().address;
      DQ.city = request.body().city;
      DQ.state = request.body().state;
      DQ.country = request.body().country;

      await DQ.save();
      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Update Successfully!',
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
