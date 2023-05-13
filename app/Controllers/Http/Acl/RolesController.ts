import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { BaseController } from 'App/Controllers/BaseController';
import Role from 'App/Models/Acl/Role';
import HttpCodes from 'App/Enums/HttpCodes';
import Pagination from 'App/Enums/Pagination';

export default class RolesController extends BaseController {
  public MODEL: typeof Role;

  constructor() {
    super();
    this.MODEL = Role;
  }
  // create new Role
  public async create({ request, response }: HttpContextContract) {
    try {
      const roleExist = await this.MODEL.findBy('name', request.body().name);
      if (roleExist) {
        return response
          .status(HttpCodes.CONFLICTS)
          .send({ message: 'Role already exists!' });
      }
      const role = new this.MODEL();
      role.name = request.input('name');
      const data = await role.save();
      await role.related('permissions').sync(request.body().permissions);
      return response.send({
        code: 200,
        message: 'Role Created Successfully!',
        result: data,
      });
    } catch (e) {
      console.log(e);
      return response
        .status(HttpCodes.SERVER_ERROR)
        .send({ status: false, message: e.toString() });
    }
  }
  // find all Roles  list
  public async find({ request, response }: HttpContextContract) {
    let baseQuery = this.MODEL.query();
    if (request.input('name')) {
      baseQuery.where('name', 'like', `${request.input('name')}%`);
    }

    return response.send({
      code: 200,
      result: await baseQuery
        .preload('permissions')
        .paginate(
          request.input(Pagination.PAGE_KEY, Pagination.PAGE),
          request.input(Pagination.PER_PAGE_KEY, Pagination.PER_PAGE)
        ),
      message: 'Roles Found Successfully',
    });
  }
  // update Role using id
  public async update({ request, response }: HttpContextContract) {
    try {
      const role = await this.MODEL.findBy('id', request.param('id'));
      if (!role) {
        return response
          .status(HttpCodes.NOT_FOUND)
          .send({ status: false, message: 'Role does not exists!' });
      }
      const roleTypeExist = await this.MODEL.query()
        .where('name', 'like', request.body().name)
        .whereNot('id', request.param('id'))
        .first();
      if (roleTypeExist) {
        return response.status(HttpCodes.CONFLICTS).send({
          status: false,
          message: `${request.body().name} Role type already exist!`,
        });
      }
      role.name = request.body().name;
      await role.related('permissions').sync(request.body().permissions);
      await role.save();
      return response.send({
        code: 200,
        message: 'Role updated Successfully!',
        result: role,
      });
    } catch (e) {
      console.log(e);
      return response
        .status(HttpCodes.SERVER_ERROR)
        .send({ status: false, message: e.message });
    }
  }
  // find Role using id
  public async get({ request, response }: HttpContextContract) {
    try {
      const data = await this.MODEL.query()
        .where('id', request.param('id'))
        .preload('permissions')
        .first();
      return response.send({
        code: 200,
        message: 'Role find Successfully!',
        result: data,
      });
    } catch (e) {
      return response
        .status(HttpCodes.SERVER_ERROR)
        .send({ status: false, message: e.toString() });
    }
  }
  // delete Role using id
  public async destroy({ request, response }: HttpContextContract) {
    const data = await this.MODEL.findBy('id', request.param('id'));
    if (!data) {
      return response.status(HttpCodes.NOT_FOUND).send({
        status: false,
        message: 'Role not found',
      });
    }
    await data.delete();
    return response.send({
      code: 200,
      result: { message: 'Role deleted successfully' },
    });
  }
}
