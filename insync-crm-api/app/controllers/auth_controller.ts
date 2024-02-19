import BaseController from '#controllers/base_controller'
import { HttpContext } from '@adonisjs/core/http'
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
   * @requestBody {"email": "iqbal@gmail.com","password":"123456"}
   */
  async register({ request, response }: HttpContext) {
    try {
      let userExists = await this.MODEL.findBy('email', request.body().email)
      if (userExists && !userExists.is_email_verified) {
        delete userExists.$attributes.password

        return response.conflict({
          code: HttpCodes.CONFLICTS,
          message: `Provided Email: ' ${request.body().email} ' Already exists`,
        })
      }
      const userRole = await Role.findBy('name', request.body().user_type)

      const user = new this.MODEL()
      user.email = request.body().email
      user.password = request.body().password
      user.user_type = request.body().user_type

      await user.save()

      user.related('userProfile').create({
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
        message: 'User Register Successfully!',
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
  async login({ auth, request, response }: HttpContext) {
    try {
      // const email = request.input('email')
      // const password = request.input('password')

      // let user = await this.MODEL.findBy('email', email)
      // if (!user) {
      //   return response.notFound({
      //     code: HttpCodes.NOT_FOUND,
      //     message: 'User Not Found',
      //   })
      // }
      // const isPasswordValid = await hash.verify(user.password, password)
      // if (!isPasswordValid) {
      //   return response.unauthorized({
      //     code: HttpCodes.UNAUTHORIZED,
      //     message: 'Invalid Password',
      //   })
      // }
      // const token = await auth.use('api').attempt(email, password)
      const { email, password } = request.only(['email', 'password'])
      const user = await this.MODEL.verifyCredentials(email, password)
      const token = await this.MODEL.accessTokens.create(user)
      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'User Login Successfully!',
        result: {
          token: token,
          user: auth.user,
        },
      })
    } catch (e) {
      return response.internalServerError({
        code: HttpCodes.SERVER_ERROR,
        message: e.toString(),
      })
    }
  }

  async logout({ auth, request, response }: HttpContext) {
    const user = auth.user!
    await this.MODEL.accessTokens.delete(user, request.param('id'))
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
