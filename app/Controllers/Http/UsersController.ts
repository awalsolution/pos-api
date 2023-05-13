import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { BaseController } from 'App/Controllers/BaseController';
import { RegistorValidator } from 'App/Validators/user/RegistorValidator';
import Role from 'App/Models/Acl/Role';
import User from 'App/Models/User';
import HttpCodes from 'App/Enums/HttpCodes';
import ResponseMessages from 'App/Enums/ResponseMessages';
// import UpdateUserValidator from "App/Validators/user/UpdateUserValidator";
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
    try {
      let user = await this.MODEL.findBy('email', request.body().email);
      if (user && !user.isEmailVerified) {
        delete user.$attributes.password;
        return response.conflict({
          status: false,
          message: 'Already exists',
          result: { user: user, verified: false },
        });
      }

      user = await this.MODEL.create(payload);
      const userRole = await Role.findBy('name', request.body().user_type);
      if (userRole) {
        user.related('roles').sync([userRole.id]);
      }
      delete user.$attributes.password;

      return response.send({
        status: true,
        message: 'User Register Successfully',
        result: user,
      });
    } catch (e) {
      console.log('register error', e.toString());
      return response.internalServerError({
        status: false,
        message: e.toString(),
      });
    }
  }

  // find all Roles  list
  public async find({ request, response }: HttpContextContract) {
    let data = this.MODEL.query();

    return response.send({
      code: 200,
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
      message: 'Users Found Successfully',
    });
  }

  // find single user by id
  public async get({ request, response }: HttpContextContract) {
    try {
      const data = await this.MODEL.findBy('id', request.param('id'));
      if (data) {
        delete data.$attributes.password;
      }
      // return response.send({ status: true, result: data || {} });
      return response.send({
        code: 200,
        message: 'User find Successfully!',
        result: data,
      });
    } catch (e) {
      return response
        .status(HttpCodes.SERVER_ERROR)
        .send({ status: false, message: e.toString() });
    }
  }

  // update user
  // public async update({ auth, request, response }: HttpContextContract) {
  // const payload = await request.validate(UpdateUserValidator);
  // const exists = await this.MODEL.findBy("id", request.param("id"));
  // if (!exists) {
  // return response.notFound({
  // message: ResponseMessages.NOT_FOUND,
  // });
  // }

  // check to see if a user is eligible to update
  // const user = auth.user;
  // if (
  //   !(this.isSuperAdmin(user) || this.isAdmin(user) || user?.id === exists.id)
  // ) {
  //   return response.forbidden({
  //     message: ResponseMessages.FORBIDDEN,
  //   });
  // }
  // await exists.merge(payload).save();
  // if (payload.roles) {
  // const roles: Role[] = await Role.query().whereIn("name", payload.roles);
  // exists.related("roles").sync(roles.map((role) => role.id));
  // }
  // delete exists.$attributes.password;
  //   return response.ok({
  //     message: "User updated Successfully",
  //     result: exists,
  //   });
  // }

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
    return response.send({
      code: 200,
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
    return response.send({
      code: 200,
      result: auth.user,
      message: 'User find Successfully',
    });
  }
}
