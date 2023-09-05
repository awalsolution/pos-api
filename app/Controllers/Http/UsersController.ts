import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { BaseController } from 'App/Controllers/BaseController';
import User from 'App/Models/User';
import HttpCodes from 'App/Enums/HttpCodes';
import ResponseMessages from 'App/Enums/ResponseMessages';
import Pagination from 'App/Enums/Pagination';

export default class UsersController extends BaseController {
  public MODEL: typeof User;

  constructor() {
    super();
    this.MODEL = User;
  }
  // create new user
  public async create({ auth, request, response }: HttpContextContract) {
    const currentUser = auth.user!;
    try {
      let userExists = await this.MODEL.findBy('email', request.body().email);
      if (userExists && !userExists.isEmailVerified) {
        delete userExists.$attributes.password;

        return response.conflict({
          code: HttpCodes.CONFLICTS,
          message: `Provided Email: ' ${request.body().email} ' Already exists`,
        });
      }

      const user = new this.MODEL();
      if (this.isSuperAdmin(currentUser)) {
        user.shopId = request.body().shop_id;
      } else {
        user.shopId = currentUser.shopId;
      }
      user.email = request.body().email;
      user.status = request.body().status;
      user.password = request.body().password;

      await user.save();
      user.related('roles').sync(request.body().roles);
      user.related('profile').create({
        first_name: request.body().first_name,
        last_name: request.body().last_name,
        phone_number: request.body().phone_number,
      });

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
  public async findAllRecord({ auth, request, response }: HttpContextContract) {
    const user = auth.user!;
    let data = this.MODEL.query().whereNot('id', user.id);
    // name filter
    if (request.input('name')) {
      data = data.whereILike('name', request.input('name') + '%');
    }

    if (!this.isSuperAdmin(user)) {
      data = data.where('shop_id', user.shopId!);
    }

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
  public async findSingleRecord({ request, response }: HttpContextContract) {
    try {
      const data = await this.MODEL.query()
        .where('id', request.param('id'))
        .preload('permissions')
        .preload('roles', (rolesQuery) => {
          rolesQuery
            .where('name', '!=', 'super admin') // Exclude the "super admin" role
            .preload('permissions');
        })
        .preload('profile')
        .preload('shop')
        .first();
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
  public async update({ auth, request, response }: HttpContextContract) {
    const currentUser = auth.user!;
    const user = await this.MODEL.findBy('id', request.param('id'));
    if (!user) {
      return response.notFound({
        code: HttpCodes.NOT_FOUND,
        message: 'User Not Found',
      });
    }

    if (this.isSuperAdmin(currentUser)) {
      user.shopId = request.body().shop_id;
    } else {
      user.shopId = currentUser.shopId;
    }

    user.email = request.body().email;
    user.status = request.body().status;

    await user.save();
    user.related('permissions').sync(request.body().permissions);
    user.related('roles').sync(request.body().roles);

    delete user.$attributes.password;
    return response.ok({
      code: HttpCodes.SUCCESS,
      message: 'User Update successfully.',
      result: user,
    });
  }

  public async assignPermission({
    auth,
    request,
    response,
  }: HttpContextContract) {
    const currentUser = auth.user!;
    const user = await this.MODEL.findBy('id', request.param('id'));
    if (!user) {
      return response.notFound({
        code: HttpCodes.NOT_FOUND,
        message: 'User Not Found',
      });
    }

    if (this.isSuperAdmin(currentUser)) {
      user.shopId = request.body().shop_id;
    } else {
      user.shopId = currentUser.shopId;
    }

    await user.save();
    user.related('permissions').sync(request.body().permissions);

    delete user.$attributes.password;
    return response.ok({
      code: HttpCodes.SUCCESS,
      message: 'Assigned Permissions successfully.',
      result: user,
    });
  }

  // update user profile
  public async profileUpdate({ request, response }: HttpContextContract) {
    const user = await this.MODEL.findBy('id', request.param('id'));
    if (!user) {
      return response.notFound({
        code: HttpCodes.NOT_FOUND,
        message: 'User Not Found',
      });
    }
    user.related('profile').updateOrCreate(
      {},
      {
        first_name: request.body().first_name,
        last_name: request.body().last_name,
        phone_number: request.body().phone_number,
        address: request.body().address,
        city: request.body().city,
        country: request.body().country,
        profile_picture: request.body().profile_picture,
      }
    );

    delete user.$attributes.password;
    return response.ok({
      code: HttpCodes.SUCCESS,
      message: 'User Profile Update successfully.',
      result: user,
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
