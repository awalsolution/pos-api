import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { BaseController } from 'App/Controllers/BaseController';
import HttpCodes from 'App/Enums/HttpCodes';
import Permission from 'App/Models/Acl/Permission';

export default class PermissionController extends BaseController {
  public MODEL: typeof Permission;
  constructor() {
    super();
    this.MODEL = Permission;
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

    if (perPage) {
      return response.ok({
        code: HttpCodes.SUCCESS,
        result: await DQ.preload('menus').paginate(page, perPage),
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

  public async findSingleRecord({ request, response }: HttpContextContract) {
    try {
      const DQ = await this.MODEL.findBy('id', request.param('id'));
      if (!DQ) {
        return response.notFound({
          code: HttpCodes.NOT_FOUND,
          message: 'Data does not exists!',
        });
      }
      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Record find Successfully!',
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
   * @requestBody <Permission>
   */
  public async create({ request, response }) {
    try {
      const DE = await this.MODEL.findBy('name', request.body().name);
      if (DE) {
        return response.conflict({
          code: HttpCodes.CONFLICTS,
          message: 'Data already exists!',
        });
      }
      const DM = new this.MODEL();

      DM.menuId = request.body().menu_id;
      DM.name = request.body().name;
      DM.type = request.body().type;

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
   * @requestBody <Permission>
   */
  public async update({ request, response }: HttpContextContract) {
    try {
      const DQ = await this.MODEL.findBy('id', request.param('id'));
      if (!DQ) {
        return response.notFound({
          code: HttpCodes.NOT_FOUND,
          message: 'Data does not exists!',
        });
      }
      const permissionExists = await this.MODEL.query()
        .where('name', 'like', request.body().name)
        .whereNot('id', request.param('id'))
        .first();

      if (permissionExists) {
        return response.conflict({
          code: HttpCodes.CONFLICTS,
          message: 'Data already exist!',
        });
      }

      DQ.menuId = request.body().menu_id;
      DQ.name = request.body().name;
      DQ.type = request.body().type;

      await DQ.save();
      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Updated Successfully!',
        result: DQ,
      });
    } catch (e) {
      return response.internalServerError({
        code: HttpCodes.SERVER_ERROR,
        message: e.message,
      });
    }
  }

  public async destroy({ request, response }) {
    const DQ = await this.MODEL.findBy('id', request.param('id'));
    if (!DQ) {
      return response.notFound({
        code: HttpCodes.NOT_FOUND,
        message: 'Data not found',
      });
    }
    await DQ.delete();
    return response.ok({
      code: HttpCodes.SUCCESS,
      message: 'Record deleted successfully',
    });
  }
}
