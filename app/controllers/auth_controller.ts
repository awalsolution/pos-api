import BaseController from '#controllers/base_controller'
import { HttpContext } from '@adonisjs/core/http'
import ResponseMessages from '#enums/response_messages'
import HttpCodes from '#enums/http_codes'
import Role from '#models/role'
import User from '#models/user'

export default class AuthController extends BaseController {
  declare MODEL: typeof User

  constructor() {
    super()
    this.MODEL = User
  }

  /**
   * @register
   * @requestBody {"email": "iqbal@gmail.com","password":"123456","user_type":"customer"}
   */
  async register({ request, response }: HttpContext) {
    try {
      let DE = await this.MODEL.findBy('email', request.body().email)
      if (DE && !DE.is_email_verified) {
        delete DE.$attributes.password

        return response.conflict({
          code: HttpCodes.CONFLICTS,
          message: 'Record already exists!',
        })
      }
      const userRole = await Role.findBy('name', request.body().user_type)

      const user = new this.MODEL()
      user.email = request.body().email
      user.password = request.body().password
      user.user_type = request.body().user_type

      await user.save()

      user.related('user_profile').create({
        first_name: request.body().first_name,
        last_name: request.body().last_name,
        phone_number: request.body().phone_number,
      })
      // assign role to user
      if (userRole) {
        user.related('roles').sync([userRole.id])
      }
      delete user.$attributes.password
      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Register Successfully!',
        result: user,
      })
    } catch (e) {
      console.log('register error', e.toString())
      return response.internalServerError({
        code: HttpCodes.SERVER_ERROR,
        message: e.toString(),
      })
    }
  }

  /**
   * @login
   * @requestBody {"email": "iqbal@gmail.com","password":"123456"}
   */
  async login({ request, response }: HttpContext) {
    try {
      const { email, password } = request.only(['email', 'password'])
      const user = await this.MODEL.verifyCredentials(email, password)
      const token = await this.MODEL.accessTokens.create(user, ['*'], {
        name: 'login_token',
      })
      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Login Successfully!',
        data: token,
      })
    } catch (e) {
      console.log(e)
      return response.internalServerError({
        code: HttpCodes.SERVER_ERROR,
        message: e.toString(),
      })
    }
  }

  async authenticated({ auth, response }: HttpContext) {
    const authenticatedUser = auth.user!
    if (!authenticatedUser) {
      return response.unauthorized({ message: ResponseMessages.UNAUTHORIZED })
    }
    delete authenticatedUser.$attributes.password
    if (authenticatedUser.user_type === 'customer') {
      const data = await this.MODEL.query()
        .where('id', authenticatedUser.id)
        .preload('user_profile')
        .preload('shop')
        .first()

      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'User find Successfully',
        result: data,
      })
    } else {
      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'User find Successfully',
        result: auth.user,
      })
    }
  }

  async logout({ auth, response }: HttpContext) {
    const currentUser = auth.user!
    await this.MODEL.accessTokens.delete(currentUser, currentUser.currentAccessToken.identifier)
    return response.ok({
      code: HttpCodes.SUCCESS,
      message: 'User logged out Successfully',
    })
  }

  // async resetPasswordUsingOldPassword({ auth, request, response }: HttpContext) {
  //   if (!auth.user) {
  //     return response.unauthorized({ message: ResponseMessages.UNAUTHORIZED })
  //   }
  //   const payload = await request.validate(OldPasswordResetValidator)
  //   const passwordMatched = await Hash.verify(auth.user.password, payload.oldPassword)
  //   if (passwordMatched) {
  //     const user = await User.findBy('id', auth.user.id)
  //     if (user) {
  //       await user
  //         .merge({
  //           password: payload.password,
  //         })
  //         .save()
  //       return response.send({ message: 'Password changed' })
  //     }
  //     return response.notFound({ message: 'User' })
  //   }
  //   return response.notAcceptable({ message: 'Wrong password' })
  // }
}
