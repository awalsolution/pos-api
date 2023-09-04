import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { BaseController } from 'App/Controllers/BaseController';
import HttpCodes from 'App/Enums/HttpCodes';
import Pagination from 'App/Enums/Pagination';
import Attribute from 'App/Models/product/Attribute';

export default class AttributesController extends BaseController {
  public MODEL: typeof Attribute;
  constructor() {
    super();
    this.MODEL = Attribute;
  }
  // find attribute list
  public async find({ request, response }: HttpContextContract) {
    let data = this.MODEL.query();

    // name filter
    if (request.input('name')) {
      data = data.whereILike('name', request.input('name') + '%');
    }

    if (!data) {
      return response.notFound({
        code: HttpCodes.NOT_FOUND,
        message: 'Attributes Data is Empty',
      });
    }
    return response.ok({
      code: HttpCodes.SUCCESS,
      result: await data.paginate(
        request.input(Pagination.PAGE_KEY, Pagination.PAGE),
        request.input(Pagination.PER_PAGE_KEY, Pagination.PER_PAGE)
      ),
      message: 'Attributes find Successfully',
    });
  }
  // find attribute using id
  public async get({ request, response }: HttpContextContract) {
    try {
      const data = await this.MODEL.query()
        .where('id', request.param('id'))
        .first();

      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Attribute find successfully',
        result: data,
      });
    } catch (e) {
      return response.internalServerError({
        code: HttpCodes.SERVER_ERROR,
        message: e.toString(),
      });
    }
  }
  // create new attribute
  public async create({ request, response }: HttpContextContract) {
    try {
      const exist = await this.MODEL.findBy('name', request.body().name);

      if (exist) {
        return response.conflict({
          code: HttpCodes.CONFLICTS,
          message: `Attribute: "${request.body().name}" already exists!`,
        });
      }
      const attribute = new this.MODEL();
      attribute.name = request.body().name;

      const data = await attribute.save();
      return response.ok({
        code: HttpCodes.SUCCESS,
        message: `Attribute: "${request.body().name}" Created Successfully!`,
        result: data,
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
  public async update({ request, response }: HttpContextContract) {
    try {
      const attribute = await this.MODEL.findBy('id', request.param('id'));
      if (!attribute) {
        return response.status(HttpCodes.NOT_FOUND).send({
          code: HttpCodes.NOT_FOUND,
          message: 'Attribute does not exists!',
        });
      }
      const exist = await this.MODEL.query()
        .where('name', 'like', request.body().name)
        .whereNot('id', request.param('id'))
        .first();

      if (exist) {
        return response.conflict({
          code: HttpCodes.CONFLICTS,
          message: `Attribute: "${request.body().name}" already exists!`,
        });
      }
      attribute.name = request.body().name;

      await attribute.save();
      return response.ok({
        code: HttpCodes.SUCCESS,
        message: `Attribute: "${request.body().name}" Update Successfully!`,
        result: attribute,
      });
    } catch (e) {
      console.log(e);
      return response.internalServerError({
        code: HttpCodes.SERVER_ERROR,
        message: e.toString(),
      });
    }
  }
  //update attribute status
  public async updateAttributeStatus({
    request,
    response,
  }: HttpContextContract) {
    const data = await this.MODEL.findBy('id', request.param('id'));
    if (!data) {
      return response.notFound({
        code: HttpCodes.NOT_FOUND,
        message: 'Attribute not found',
      });
    }
    data.status = request.body().status;
    await data.save();
    return response.ok({
      code: HttpCodes.SUCCESS,
      result: { message: 'Attribute Status Update successfully' },
    });
  }

  // delete attribute using id
  public async destroy({ request, response }: HttpContextContract) {
    const data = await this.MODEL.findBy('id', request.param('id'));
    if (!data) {
      return response.notFound({
        code: HttpCodes.NOT_FOUND,
        message: 'Attribute not found',
      });
    }
    await data.delete();
    return response.ok({
      code: HttpCodes.SUCCESS,
      result: { message: 'Attribute deleted successfully!' },
    });
  }
}
