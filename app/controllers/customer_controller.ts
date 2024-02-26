import BaseController from '#controllers/base_controller'
import { HttpContext } from '@adonisjs/core/http'
import HttpCodes from '#enums/http_codes'
import Customer from '#models/customer'

export default class CustomerController extends BaseController {
  MODEL: typeof Customer

  constructor() {
    super()
    this.MODEL = Customer
  }

  /**
   * @findAllRecords
   * @paramUse(paginated)
   */
  async findAllRecords({ request, response }: HttpContext) {
    let DQ = this.MODEL.query()

    const page = request.input('page')
    const perPage = request.input('perPage')

    // name filter
    if (request.input('name')) {
      DQ = DQ.whereILike('email', request.input('name') + '%')
    }

    if (!DQ) {
      return response.notFound({
        code: HttpCodes.NOT_FOUND,
        message: 'Data not found',
      })
    }

    if (perPage) {
      return response.ok({
        code: HttpCodes.SUCCESS,
        result: await DQ.preload('customer_profile').paginate(page, perPage),
        message: 'Record find successfully!',
      })
    } else {
      return response.ok({
        code: HttpCodes.SUCCESS,
        result: await DQ.preload('customer_profile'),
        message: 'Record find successfully!',
      })
    }
  }

  async findSingleRecord({ request, response }: HttpContext) {
    try {
      const data = await this.MODEL.query()
        .where('id', request.param('id'))
        .preload('customer_profile')
        .first()

      if (data) {
        delete data.$attributes.password
      }

      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Record find successfully!',
        result: data,
      })
    } catch (e) {
      console.log(e)
      return response.internalServerError({
        code: HttpCodes.SERVER_ERROR,
        message: e.toString(),
      })
    }
  }

  /**
   * @create
   * @requestBody {"first_name":"Iqbal", "last_name":"Hassan", "email":"iqbal@gmail.com", "password":"123456","phone_number":"123456789"}
   */
  async create({ request, response }: HttpContext) {
    try {
      let DE = await this.MODEL.findBy('email', request.body().email)
      if (DE && !DE.is_email_verified) {
        delete DE.$attributes.password

        return response.conflict({
          code: HttpCodes.CONFLICTS,
          message: 'Record already exists!',
        })
      }

      const DM = new this.MODEL()

      DM.email = request.body().email
      DM.status = request.body().status
      DM.password = request.body().password

      await DM.save()

      DM.related('customer_profile').create({
        first_name: request.body().first_name,
        last_name: request.body().last_name,
        phone_number: request.body().phone_number,
      })

      delete DM.$attributes.password
      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Register successfully!',
        result: DM,
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
   * @update
   * @requestBody <Customer>
   */
  async update({ request, response }: HttpContext) {
    const DQ = await this.MODEL.findBy('id', request.param('id'))
    if (!DQ) {
      return response.notFound({
        code: HttpCodes.NOT_FOUND,
        message: 'Data not found',
      })
    }

    DQ.email = request.body().email
    DQ.status = request.body().status
    DQ.password = request.body().password

    await DQ.save()

    delete DQ.$attributes.password
    return response.ok({
      code: HttpCodes.SUCCESS,
      message: 'Update successfully!',
      result: DQ,
    })
  }

  /**
   * @updateStatus
   * @requestBody {"status":0}
   */
  async updateStatus({ request, response }: HttpContext) {
    const DQ = await this.MODEL.findBy('id', request.param('id'))

    if (!DQ) {
      return response.notFound({
        code: HttpCodes.NOT_FOUND,
        message: 'Data not found!',
      })
    }

    DQ.status = request.body().status

    await DQ.save()

    delete DQ.$attributes.password
    return response.ok({
      code: HttpCodes.SUCCESS,
      message: 'Update successfully!',
      result: DQ,
    })
  }

  /**
   * @profileUpdate
   * @requestBody {"first_name":"Iqbal","last_name":"Hassan","phone_number":"123456789","address":"Johar Town","city":"Lahore","state":"Punjab","country":"Pakistan","profile_picture":"/uploads/profile_picture/user-profile.jpg"}
   */
  async profileUpdate({ request, response }: HttpContext) {
    const DQ = await this.MODEL.findBy('id', request.param('id'))
    if (!DQ) {
      return response.notFound({
        code: HttpCodes.NOT_FOUND,
        message: 'Data not found',
      })
    }
    DQ.related('customer_profile').updateOrCreate(
      {},
      {
        first_name: request.body().first_name,
        last_name: request.body().last_name,
        phone_number: request.body().phone_number,
        address: request.body().address,
        city: request.body().city,
        state: request.body().state,
        country: request.body().country,
        profile_picture: request.body().profile_picture,
      }
    )

    delete DQ.$attributes.password
    return response.ok({
      code: HttpCodes.SUCCESS,
      message: 'Update successfully!',
      result: DQ,
    })
  }

  async destroy({ request, response }: HttpContext) {
    const DQ = await this.MODEL.findBy('id', request.param('id'))
    if (!DQ) {
      return response.notFound({
        code: HttpCodes.NOT_FOUND,
        message: 'Data not found',
      })
    }
    await DQ.delete()
    return response.ok({
      code: HttpCodes.SUCCESS,
      message: 'Record deleted successfully!',
    })
  }
}
