import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { BaseController } from 'App/Controllers/BaseController';
import HttpCodes from 'App/Enums/HttpCodes';
import Pagination from 'App/Enums/Pagination';
import Permission from 'App/Models/Acl/Permission';

export default class PermissionsController extends BaseController {
  public MODEL: typeof Permission;
  constructor() {
    super();
    this.MODEL = Permission;
  }
  // find permissions list
  public async find({ request, response }: HttpContextContract) {
    let baseQuery = this.MODEL.query();
    if (request.input('name')) {
      baseQuery.where('name', 'like', `${request.input('name')}%`);
    }
    return response.send({
      code: 200,
      result: await baseQuery.paginate(
        request.input(Pagination.PAGE_KEY, Pagination.PAGE),
        request.input(Pagination.PER_PAGE_KEY, Pagination.PER_PAGE)
      ),
      message: 'Permissions Found Successfully',
    });
  }
  // create new permission
  public async create({ request, response }: HttpContextContract) {
    try {
      const permissionExists = await this.MODEL.findBy(
        'name',
        request.body().name
      );
      if (permissionExists) {
        return response.conflict({ message: 'Permission already exists!' });
      }
      const permission = new this.MODEL();
      permission.name = request.input('name');
      permission.description = request.input('description');
      const data = await permission.save();
      return response.send({
        code: 200,
        message: 'Permission Created Successfully!',
        result: data,
      });
    } catch (e) {
      console.log(e);
      return response
        .status(HttpCodes.SERVER_ERROR)
        .send({ status: false, message: e.toString() });
    }
  }
  // update existing permission
  public async update({ request, response }: HttpContextContract) {
    try {
      const permission = await this.MODEL.findBy('id', request.param('id'));
      if (!permission) {
        return response
          .status(HttpCodes.NOT_FOUND)
          .send({ status: false, message: 'Permission does not exists!' });
      }
      const permissionExists = await this.MODEL.query()
        .where('name', 'like', request.body().name)
        .whereNot('id', request.param('id'))
        .first();
      if (permissionExists) {
        return response.status(HttpCodes.CONFLICTS).send({
          status: false,
          message: `${request.body().name} permission already exist!`,
        });
      }
      permission.name = request.body().name;
      permission.description = request.body().description;
      await permission.save();
      return response.send({
        code: 200,
        message: 'Permission Updated Successfully!',
        result: permission,
      });
    } catch (e) {
      return response
        .status(HttpCodes.SERVER_ERROR)
        .send({ status: false, message: e.message });
    }
  }
  // find single permission using id
  public async get({ request, response }: HttpContextContract) {
    try {
      const data = await this.MODEL.findBy('id', request.param('id'));
      if (!data) {
        return response
          .status(HttpCodes.NOT_FOUND)
          .send({ status: false, message: 'Permission does not exists!' });
      }
      return response.send({
        code: 200,
        message: 'Permission find Successfully!',
        result: data,
      });
    } catch (e) {
      return response
        .status(HttpCodes.SERVER_ERROR)
        .send({ status: false, message: e.toString() });
    }
  }
  // delete single permission using id
  public async destroy({ request, response }: HttpContextContract) {
    const data = await this.MODEL.findBy('id', request.param('id'));
    if (!data) {
      return response.status(HttpCodes.NOT_FOUND).send({
        status: false,
        message: 'Permission not found',
      });
    }
    await data.delete();
    return response.send({
      code: 200,
      result: { message: 'Permission deleted successfully' },
    });
  }
}
