import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { BaseController } from 'App/Controllers/BaseController';
import { RegistorValidator } from 'App/Validators/user/RegistorValidator';
// import Role from 'App/Models/Acl/Role';
import User from 'App/Models/User';
import HttpCodes from 'App/Enums/HttpCodes';
import ResponseMessages from 'App/Enums/ResponseMessages';
// import UpdateUserValidator from 'App/Validators/user/UpdateUserValidator';
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
    const payload = await request.validate(RegistorValidator);
    console.log('object', request.body().email);
    try {
      let userExists = await this.MODEL.findBy('email', request.body().email);
      console.log('userExists', userExists);
      if (userExists && !userExists.isEmailVerified) {
        delete userExists.$attributes.password;
        return response.status(HttpCodes.CONFLICTS).send({
          code: HttpCodes.CONFLICTS,
          message: 'User Already exists',
          result: userExists,
        });
      }
      const user = new this.MODEL();
      user.email = payload.email;
      user.password = payload.password;
      user.userType = payload.user_type;
      await user.save();
      user.related('profile').create({
        first_name: request.body().first_name,
        last_name: request.body().last_name,
      });
      return response.status(HttpCodes.SUCCESS).send({
        code: HttpCodes.SUCCESS,
        message: 'User Register Successfully!',
        result: user,
      });
    } catch (e) {
      console.log('register error', e.toString());
      return response
        .status(HttpCodes.SERVER_ERROR)
        .send({ code: HttpCodes.SERVER_ERROR, message: e.toString() });
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
  // public async update({ auth, request, response }: HttpContextContract) {
  //   const payload = await request.validate(UpdateUserValidator);
  //   const exists = await this.MODEL.findBy('id', request.param('id'));
  //   if (!exists) {
  //     return response.status(HttpCodes.NOT_FOUND).send({
  //       code: HttpCodes.NOT_FOUND,
  //       result: { message: 'User not found' },
  //     });
  //   }

  //   // check to see if a user is eligible to update
  //   const user = auth.user;
  //   if (
  //     !(this.isSuperAdmin(user) || this.isAdmin(user) || user?.id === exists.id)
  //   ) {
  //     return response.status(HttpCodes.FORBIDDEN).forbidden({
  //       code: HttpCodes.NOT_FOUND,
  //       result: { message: ResponseMessages.FORBIDDEN },
  //     });
  //   }
  //   await exists.merge(payload).save();
  //   if (payload.roles) {
  //     const roles: Role[] = await Role.query().whereIn('name', payload.roles);
  //     exists.related('roles').sync(roles.map((role) => role.id));
  //   }
  //   delete exists.$attributes.password;
  //   return response.status(HttpCodes.SUCCESS).send({
  //     code: HttpCodes.SUCCESS,
  //     message: 'User Status Update successfully',
  //     result: exists,
  //   });
  // }

  //update user status
  public async updateUserStatus({ request, response }: HttpContextContract) {
    const data = await this.MODEL.findBy('id', request.param('id'));
    if (!data) {
      return response.status(HttpCodes.NOT_FOUND).send({
        code: HttpCodes.NOT_FOUND,
        message: 'User not found',
      });
    }
    data.status = request.body().status;
    await data.save();
    return response.status(HttpCodes.SUCCESS).send({
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
