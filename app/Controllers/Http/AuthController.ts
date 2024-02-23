import Hash from '@ioc:Adonis/Core/Hash';
import { BaseController } from 'App/Controllers/BaseController';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Role from 'App/Models/Acl/Role';
import User from 'App/Models/User';
import ResponseMessages from 'App/Enums/ResponseMessages';
import OldPasswordResetValidator from 'App/Validators/user/OldPasswordResetValidator';
import HttpCodes from 'App/Enums/HttpCodes';

export default class AuthController extends BaseController {
  public MODEL: typeof User;

  constructor() {
    super();
    this.MODEL = User;
  }

  public async register({ request, response }: HttpContextContract) {
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

      user.related('user_profile').create({
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
  public async login({ auth, request, response }: HttpContextContract) {
    try {
      const email = request.input('email');
      const password = request.input('password');

      let user = await this.MODEL.findBy('email', email);
      if (!user) {
        return response.notFound({
          code: HttpCodes.NOT_FOUND,
          message: 'User Not Found',
        });
      }
      const isPasswordValid = await Hash.verify(user.password, password);
      if (!isPasswordValid) {
        return response.unauthorized({
          code: HttpCodes.UNAUTHORIZED,
          message: 'Invalid Password',
        });
      }
      const DQ = await auth.use('api').attempt(email, password);
      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'User Login Successfully!',
        token: DQ.token,
      });
    } catch (e) {
      return response.internalServerError({
        code: HttpCodes.SERVER_ERROR,
        message: e.toString(),
      });
    }
  }

  public async logout({ auth, response }: HttpContextContract) {
    await auth.use('api').logout();
    return response.ok({
      code: HttpCodes.SUCCESS,
      message: 'User logged out Successfully',
    });
  }

  public async resetPasswordUsingOldPassword({
    auth,
    request,
    response,
  }: HttpContextContract) {
    if (!auth.user) {
      return response.unauthorized({ message: ResponseMessages.UNAUTHORIZED });
    }
    const payload = await request.validate(OldPasswordResetValidator);
    const passwordMatched = await Hash.verify(
      auth.user.password,
      payload.oldPassword
    );
    if (passwordMatched) {
      const user = await User.findBy('id', auth.user.id);
      if (user) {
        await user
          .merge({
            password: payload.password,
          })
          .save();
        return response.send({ message: 'Password changed' });
      }
      return response.notFound({ message: 'User' });
    }
    return response.notAcceptable({ message: 'Wrong password' });
  }
}
