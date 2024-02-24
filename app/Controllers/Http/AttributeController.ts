import { BaseController } from 'App/Controllers/BaseController';
import HttpCodes from 'App/Enums/HttpCodes';
import Attribute from 'App/Models/product/Attribute';

export default class AttributeController extends BaseController {
  public MODEL: typeof Attribute;
  constructor() {
    super();
    this.MODEL = Attribute;
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
          message: 'Record not found!',
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
   * @requestBody <Attribute>
   */
  public async create({ request, response }) {
    try {
      const DE = await this.MODEL.findBy('name', request.body().name);

      if (DE) {
        return response.conflict({
          code: HttpCodes.CONFLICTS,
          message: 'Record already exists!',
        });
      }

      const DM = new this.MODEL();

      DM.name = request.body().name;

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

  /**
   * @update
   * @requestBody <Attribute>
   */
  public async update({ request, response }) {
    try {
      const DQ = await this.MODEL.findBy('id', request.param('id'));

      if (!DQ) {
        return response.notFound({
          code: HttpCodes.NOT_FOUND,
          message: 'Record does not exists!',
        });
      }

      const DE = await this.MODEL.query()
        .where('name', 'like', request.body().name)
        .whereNot('id', request.param('id'))
        .first();

      if (DE) {
        return response.conflict({
          code: HttpCodes.CONFLICTS,
          message: 'Record already exists!',
        });
      }

      DQ.name = request.body().name;

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
      message: 'Record deleted successfully!',
    });
  }
}
