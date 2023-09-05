import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { BaseController } from 'App/Controllers/BaseController';
import HttpCodes from 'App/Enums/HttpCodes';
import Permission from 'App/Models/Acl/Permission';

export default class PermissionsController extends BaseController {
  public MODEL: typeof Permission;
  constructor() {
    super();
    this.MODEL = Permission;
  }
  // find permissions list
  public async findAllRecords({ request, response }) {
    let DQ = this.MODEL.query();

    const page = request.input('page');
    const pageSize = request.input('pageSize');

    // name filter
    if (request.input('name')) {
      DQ = DQ.whereILike('name', request.input('name') + '%');
    }

    if (pageSize) {
      return response.ok({
        code: HttpCodes.SUCCESS,
        result: await DQ.preload('menus').paginate(page, pageSize),
        message: 'Permissions Found Successfully',
      });
    } else {
      return response.ok({
        code: HttpCodes.SUCCESS,
        result: await DQ.select('*'),
        message: 'Permissions Found Successfully',
      });
    }
  }

  // find single permission using id
  public async findSingleRecord({ request, response }: HttpContextContract) {
    try {
      const DQ = await this.MODEL.findBy('id', request.param('id'));
      if (!DQ) {
        return response.notFound({
          code: HttpCodes.NOT_FOUND,
          message: 'Permission does not exists!',
        });
      }
      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Permission find Successfully!',
        result: DQ,
      });
    } catch (e) {
      return response.internalServerError({
        code: HttpCodes.SERVER_ERROR,
        message: e.toString(),
      });
    }
  }

  // create new permission
  public async create({ request, response }) {
    try {
      const DE = await this.MODEL.findBy('name', request.body().name);
      if (DE) {
        return response.conflict({
          code: HttpCodes.CONFLICTS,
          message: `Permission ${request.input('name')} already exists!`,
        });
      }
      const DM = new this.MODEL();

      DM.name = request.input('name');

      const DQ = await DM.save();
      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Permission Created Successfully!',
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

  // update existing permission
  public async update({ request, response }: HttpContextContract) {
    try {
      const DQ = await this.MODEL.findBy('id', request.param('id'));
      if (!DQ) {
        return response.notFound({
          code: HttpCodes.NOT_FOUND,
          message: 'Permission does not exists!',
        });
      }
      const permissionExists = await this.MODEL.query()
        .where('name', 'like', request.body().name)
        .whereNot('id', request.param('id'))
        .first();

      if (permissionExists) {
        return response.conflict({
          code: HttpCodes.CONFLICTS,
          message: `${request.body().name} permission already exist!`,
        });
      }

      DQ.name = request.body().name;

      await DQ.save();
      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Permission Updated Successfully!',
        result: DQ,
      });
    } catch (e) {
      return response.internalServerError({
        code: HttpCodes.SERVER_ERROR,
        message: e.message,
      });
    }
  }

  // delete single permission using id
  public async destroy({ request, response }) {
    const DQ = await this.MODEL.findBy('id', request.param('id'));
    if (!DQ) {
      return response.notFound({
        code: HttpCodes.NOT_FOUND,
        message: 'Permission not found',
      });
    }
    await DQ.delete();
    return response.ok({
      code: HttpCodes.SUCCESS,
      result: { message: 'Permission deleted successfully' },
    });
  }
}
