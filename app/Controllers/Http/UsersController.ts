import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { BaseController } from 'App/Controllers/BaseController';
import Role from 'App/Models/Acl/Role';
import User from 'App/Models/User';
import HttpCodes from 'App/Enums/HttpCodes';
import ResponseMessages from 'App/Enums/ResponseMessages';
import Pagination from 'App/Enums/Pagination';
// import { imageUpload } from "App/Helpers/MainHelpers";

export default class UsersController extends BaseController {
  public MODEL: typeof User;

  constructor() {
    super();
    this.MODEL = User;
  }
  // create new user
  public async create({ request, response }: HttpContextContract) {
    try {
      let userExists = await this.MODEL.findBy('email', request.body().email);
      if (userExists && !userExists.isEmailVerified) {
        delete userExists.$attributes.password;

        return response.conflict({
          code: HttpCodes.CONFLICTS,
          message: `Provided Email: ' ${request.body().email} ' Already exists`,
        });
      }
      const userRole = await Role.findBy('name', request.body().user_type);

      const user = new this.MODEL();
      user.email = request.body().email;
      user.password = request.body().password;
      user.userType = request.body().user_type;

      await user.save();

      user.related('profile').create({
        first_name: request.body().first_name,
        last_name: request.body().last_name,
        phone_number: request.body().phone_number,
      });
      // assign role to user
      if (userRole) {
        user.related('roles').sync([userRole.id]);
      }
      delete user.$attributes.password;
      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'User Register Successfully!',
        result: user,
      });
    } catch (e) {
      console.log('register error', e.toString());
      return response.internalServerError({
        code: HttpCodes.SERVER_ERROR,
        message: e.toString(),
      });
    }
  }

  // find all users  list
  public async find({ request, response }: HttpContextContract) {
    let data = this.MODEL.query();

    return response.status(HttpCodes.SUCCESS).send({
      code: HttpCodes.SUCCESS,
      result: await data
        .preload('permissions')
        .preload('roles', (rolesQuery) => {
          rolesQuery.preload('permissions');
        })
        .preload('profile')
        .preload('shop')
        .paginate(
          request.input(Pagination.PAGE_KEY, Pagination.PAGE),
          request.input(Pagination.PER_PAGE_KEY, Pagination.PER_PAGE)
        ),
      message: 'Users find Successfully',
    });
  }

  // find single user by id
  public async get({ request, response }: HttpContextContract) {
    try {
      const data = await this.MODEL.query()
        .where('id', request.param('id'))
        .preload('permissions')
        .preload('roles', (rolesQuery) => {
          rolesQuery.preload('permissions');
        })
        .preload('profile')
        .preload('shop')
        .first();
      // const data = await this.MODEL.findBy('id', request.param('id'));
      if (data) {
        delete data.$attributes.password;
      }
      return response.status(HttpCodes.SUCCESS).send({
        code: HttpCodes.SUCCESS,
        message: 'User find Successfully!',
        result: data,
      });
    } catch (e) {
      return response
        .status(HttpCodes.SERVER_ERROR)
        .send({ code: HttpCodes.SERVER_ERROR, message: e.toString() });
    }
  }

  // update user
  public async update({ request, response }: HttpContextContract) {
    const user = await this.MODEL.findBy('id', request.param('id'));
    if (!user) {
      return response.notFound({
        code: HttpCodes.NOT_FOUND,
        message: 'User Not Found',
      });
    }
    user.email = request.body().email;
    user.related('permissions').sync(request.body().permissions);
    user.related('roles').sync(request.body().roles);

    delete user.$attributes.password;
    return response.ok({
      code: HttpCodes.SUCCESS,
      message: 'User Update successfully.',
      result: user,
    });
  }

  //update user status
  public async updateUserStatus({ request, response }: HttpContextContract) {
    const data = await this.MODEL.findBy('id', request.param('id'));
    if (!data) {
      return response.notFound({
        code: HttpCodes.NOT_FOUND,
        message: 'User not found',
      });
    }
    data.status = request.body().status;
    await data.save();
    return response.ok({
      code: HttpCodes.SUCCESS,
      message: 'User Status Update successfully',
      result: data,
    });
  }

  // delete single user using id
  public async destroy({ request, response }: HttpContextContract) {
    const data = await this.MODEL.findBy('id', request.param('id'));
    if (!data) {
      return response.status(HttpCodes.NOT_FOUND).send({
        status: false,
        message: 'User not found',
      });
    }
    await data.delete();
    return response.status(HttpCodes.SUCCESS).send({
      code: HttpCodes.SUCCESS,
      result: { message: 'User deleted successfully' },
    });
  }

  // auth user
  public async authenticated({ auth, response }: HttpContextContract) {
    const authenticatedUser = auth.user;
    if (!authenticatedUser) {
      return response.unauthorized({ message: ResponseMessages.UNAUTHORIZED });
    }
    delete authenticatedUser.$attributes.password;
    return response.status(HttpCodes.SUCCESS).send({
      code: HttpCodes.SUCCESS,
      message: 'User find Successfully',
      result: auth.user,
    });
  }
}
