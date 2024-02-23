import { BaseController } from 'App/Controllers/BaseController';
import HttpCodes from 'App/Enums/HttpCodes';
import Attribute from 'App/Models/product/Attribute';

export default class AttributesController extends BaseController {
  public MODEL: typeof Attribute;
  constructor() {
    super();
    this.MODEL = Attribute;
  }

  // find attribute list
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
        message: 'Attributes Data is Empty',
      });
    }

    if (perPage) {
      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Attributes find Successfully',
        result: await DQ.paginate(page, perPage),
      });
    } else {
      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Attributes find Successfully',
        result: await DQ.select('*'),
      });
    }
  }

  // find attribute using id
  public async findSingleRecord({ request, response }) {
    try {
      const DQ = await this.MODEL.query()
        .where('id', request.param('id'))
        .first();

      if (!DQ) {
        return response.notFound({
          code: HttpCodes.NOT_FOUND,
          message: 'Attribute Data is Empty',
        });
      }

      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Attribute find successfully',
        result: DQ,
      });
    } catch (e) {
      return response.internalServerError({
        code: HttpCodes.SERVER_ERROR,
        message: e.toString(),
      });
    }
  }

  // create new attribute
  public async create({ request, response }) {
    try {
      const DE = await this.MODEL.findBy('name', request.body().name);

      if (DE) {
        return response.conflict({
          code: HttpCodes.CONFLICTS,
          message: `Attribute: "${request.body().name}" already exists!`,
        });
      }

      const DM = new this.MODEL();

      DM.name = request.body().name;

      const DQ = await DM.save();
      return response.ok({
        code: HttpCodes.SUCCESS,
        message: `Attribute: "${request.body().name}" Created Successfully!`,
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

  // update attribute using id
  public async update({ request, response }) {
    try {
      const DQ = await this.MODEL.findBy('id', request.param('id'));

      if (!DQ) {
        return response.notFound({
          code: HttpCodes.NOT_FOUND,
          message: 'Attribute does not exists!',
        });
      }

      const DE = await this.MODEL.query()
        .where('name', 'like', request.body().name)
        .whereNot('id', request.param('id'))
        .first();

      if (DE) {
        return response.conflict({
          code: HttpCodes.CONFLICTS,
          message: `Attribute: "${request.body().name}" already exists!`,
        });
      }

      DQ.name = request.body().name;

      await DQ.save();
      return response.ok({
        code: HttpCodes.SUCCESS,
        message: `Attribute: "${request.body().name}" Update Successfully!`,
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

  // delete attribute using id
  public async destroy({ request, response }) {
    const DQ = await this.MODEL.findBy('id', request.param('id'));

    if (!DQ) {
      return response.notFound({
        code: HttpCodes.NOT_FOUND,
        message: 'Attribute not found',
      });
    }

    await DQ.delete();
    return response.ok({
      code: HttpCodes.SUCCESS,
      result: { message: 'Attribute deleted successfully!' },
    });
  }
}
