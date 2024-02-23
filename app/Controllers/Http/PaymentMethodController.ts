import { BaseController } from 'App/Controllers/BaseController';
import HttpCodes from 'App/Enums/HttpCodes';
import PaymentMethod from 'App/Models/PaymentMethod';

export default class PaymentMethodController extends BaseController {
  public MODEL: typeof PaymentMethod;
  constructor() {
    super();
    this.MODEL = PaymentMethod;
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
  //  * @requestBody <PaymentMethod>
  //  */
  public async create({ request, response }) {
    try {
      const DE = await this.MODEL.findBy(
        'method_title',
        request.body().method_title
      );

      if (DE) {
        return response.conflict({
          code: HttpCodes.CONFLICTS,
          message: `Record: "${request.body().method_title}" already exists!`,
        });
      }

      const DM = new this.MODEL();

      DM.method_title = request.body().method_title;

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
  //  * @requestBody <PaymentMethod>
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

      const DE = await this.MODEL.findBy(
        'method_title',
        request.body().method_title
      );

      if (DE) {
        return response.conflict({
          code: HttpCodes.CONFLICTS,
          message: `Record: "${request.body().name}" already exists!`,
        });
      }

      DQ.method_title = request.body().method_title;

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
