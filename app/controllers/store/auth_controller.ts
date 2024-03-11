import BaseController from '#controllers/base_controller'
import { HttpContext } from '@adonisjs/core/http'
import ResponseMessages from '#enums/response_messages'
import HttpCodes from '#enums/http_codes'
import Customer from '#models/customer'

export default class AuthController extends BaseController {
  declare MODEL: typeof Customer

  constructor() {
    super()
    this.MODEL = Customer
  }

  /**
   * @Register
   * @requestBody {"first_name":"Iqbal", "last_name":"Hassan", "email":"iqbal@gmail.com", "password":"123456","phone_number":"123456789"}
   */
  async Register({ request, response }: HttpContext) {
    try {
      let DE = await this.MODEL.findBy('email', request.body().email)
      if (DE && !DE.is_email_verified) {
        delete DE.$attributes.password

        return response.conflict({
          code: HttpCodes.CONFLICTS,
          message: 'Record already exists!',
        })
      }

      const customer = new this.MODEL()
      customer.email = request.body().email
      customer.password = request.body().password

      await customer.save()

      customer.related('customer_profile').create({
        first_name: request.body().first_name,
        last_name: request.body().last_name,
        phone_number: request.body().phone_number,
      })

      delete customer.$attributes.password
      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Register successfully!',
        result: customer,
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
   * @Login
   * @requestBody {"email": "iqbal@gmail.com","password":"123456"}
   */
  async Login({ request, response }: HttpContext) {
    try {
      const { email, password } = request.only(['email', 'password'])
      const customer = await this.MODEL.verifyCredentials(email, password)
      const token = await this.MODEL.customer_token.create(customer, ['*'], {
        name: 'customer_login_token',
      })
      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Login successfully!',
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

  async Authenticated({ auth, response }: HttpContext) {
    const authenticatedUser = auth.use('customer').user!
    if (!authenticatedUser) {
      return response.unauthorized({ message: ResponseMessages.UNAUTHORIZED })
    }
    delete authenticatedUser.$attributes.password
    return response.ok({
      code: HttpCodes.SUCCESS,
      message: 'Record find successfully!',
      result: authenticatedUser,
    })
  }

  async Logout({ auth, response }: HttpContext) {
    const currentUser = auth.use('customer').user!
    await this.MODEL.customer_token.delete(currentUser, currentUser.currentAccessToken.identifier)
    return response.ok({
      code: HttpCodes.SUCCESS,
      message: 'Logout successfully!',
    })
  }
}
