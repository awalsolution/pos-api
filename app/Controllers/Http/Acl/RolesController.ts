import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { BaseController } from 'App/Controllers/BaseController';
import Role from 'App/Models/Acl/Role';
import HttpCodes from 'App/Enums/HttpCodes';

export default class RolesController extends BaseController {
  public MODEL: typeof Role;

  constructor() {
    super();
    this.MODEL = Role;
  }

  // find all Roles  list
  public async findAllRecords({ auth, request, response }) {
    const currentUser = auth.user!;
    let DQ = this.MODEL.query().whereNot('name', 'super admin');

    const page = request.input('page');
    const pageSize = request.input('pageSize');

    if (request.input('name')) {
      DQ = DQ.whereILike('name', request.input('name') + '%');
    }

    if (!this.isSuperAdmin(currentUser)) {
      DQ = DQ.where('shop_id', currentUser.shopId!);
    }

    if (pageSize) {
      return response.ok({
        code: HttpCodes.SUCCESS,
        result: await DQ.paginate(page, pageSize),
        message: 'Roles Found Successfully',
      });
    } else {
      return response.ok({
        code: HttpCodes.SUCCESS,
        result: await DQ.preload('permissions'),
        message: 'Roles Found Successfully',
      });
    }
  }

  // find Role using id
  public async findSingleRecord({ request, response }: HttpContextContract) {
    try {
      const DQ = await this.MODEL.query()
        .where('id', request.param('id'))
        .preload('permissions')
        .first();

      if (!DQ) {
        return response.notFound({
          code: HttpCodes.NOT_FOUND,
          message: 'Role does not exists!',
        });
      }

      return response.send({
        code: HttpCodes.SUCCESS,
        message: 'Role find Successfully!',
        result: DQ,
      });
    } catch (e) {
      return response.internalServerError({
        code: HttpCodes.SERVER_ERROR,
        message: e.toString(),
      });
    }
  }

  // create new Role
  public async create({ auth, request, response }: HttpContextContract) {
    const currentUser = auth.user!;
    try {
      const DE = await this.MODEL.findBy('name', request.body().name);

      if (DE) {
        return response.conflict({
          code: HttpCodes.CONFLICTS,
          message: `Role ${request.input('name')} already exists!`,
        });
      }

      const DM = new this.MODEL();

      if (this.isSuperAdmin(currentUser)) {
        DM.shopId = request.body().shop_id;
      } else {
        DM.shopId = currentUser.shopId;
      }

      DM.name = request.input('name');

      const DQ = await DM.save();
      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Role Created Successfully!',
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

  // update Role using id
  public async update({ auth, request, response }: HttpContextContract) {
    const currentUser = auth.user!;
    try {
      const DQ = await this.MODEL.findBy('id', request.param('id'));
      if (!DQ) {
        return response.notFound({
          code: HttpCodes.NOT_FOUND,
          message: 'Role does not exists!',
        });
      }
      const DE = await this.MODEL.query()
        .where('name', 'like', request.body().name)
        .whereNot('id', request.param('id'))
        .first();

      if (DE) {
        return response.conflict({
          code: HttpCodes.CONFLICTS,
          message: `${request.body().name} Role type already exist!`,
        });
      }

      if (this.isSuperAdmin(currentUser)) {
        DQ.shopId = request.body().shop_id;
      } else {
        DQ.shopId = currentUser.shopId;
      }

      DQ.name = request.body().name;

      await DQ.save();
      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Role updated Successfully!',
        result: DQ,
      });
    } catch (e) {
      console.log(e);
      return response.internalServerError({
        code: HttpCodes.SERVER_ERROR,
        message: e.message,
      });
    }
  }

  // assign permission to role
  public async assignPermission({ request, response }) {
    try {
      const DQ = await this.MODEL.findBy('id', request.param('id'));
      if (!DQ) {
        return response.notFound({
          code: HttpCodes.NOT_FOUND,
          message: 'Role does not exists!',
        });
      }

      await DQ.related('permissions').sync(request.body().permissions);
      await DQ.save();
      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Operation Successfully!',
        result: DQ,
      });
    } catch (e) {
      console.log(e);
      return response.internalServerError({
        code: HttpCodes.SERVER_ERROR,
        message: e.message,
      });
    }
  }

  // delete Role using id
  public async destroy({ request, response }) {
    const DQ = await this.MODEL.findBy('id', request.param('id'));
    if (!DQ) {
      return response.notFound({
        code: HttpCodes.NOT_FOUND,
        message: 'Role not found',
      });
    }
    await DQ.delete();
    return response.ok({
      code: HttpCodes.SUCCESS,
      result: { message: 'Role deleted successfully' },
    });
  }
}
