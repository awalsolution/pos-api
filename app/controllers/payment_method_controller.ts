import BaseController from '#controllers/base_controller'
import { HttpContext } from '@adonisjs/core/http'
import HttpCodes from '#enums/http_codes'
import PaymentMethod from '#models/payment_method'

export default class PaymentMethodController extends BaseController {
  declare MODEL: typeof PaymentMethod
  constructor() {
    super()
    this.MODEL = PaymentMethod
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
      DQ = DQ.whereILike('name', request.input('name') + '%')
    }

    if (!DQ) {
      return response.notFound({
        code: HttpCodes.NOT_FOUND,
        message: 'Data is empty',
      })
    }

    if (perPage) {
      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Record find successfully!',
        result: await DQ.paginate(page, perPage),
      })
    } else {
      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Record find successfully!',
        result: await DQ.select('*'),
      })
    }
  }

  async findSingleRecord({ request, response }: HttpContext) {
    try {
      const DQ = await this.MODEL.query().where('id', request.param('id')).first()

      if (!DQ) {
        return response.notFound({
          code: HttpCodes.NOT_FOUND,
          message: 'Data is empty',
        })
      }

      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Record find successfully',
        result: DQ,
      })
    } catch (e) {
      return response.internalServerError({
        code: HttpCodes.SERVER_ERROR,
        message: e.toString(),
      })
    }
  }

  /**
   * @create
   * @requestBody <PaymentMethod>
   */
  async create({ request, response }: HttpContext) {
    try {
      const DE = await this.MODEL.findBy('method_title', request.body().method_title)

      if (DE) {
        return response.conflict({
          code: HttpCodes.CONFLICTS,
          message: 'Record already exists!',
        })
      }

      const DM = new this.MODEL()

      DM.method_title = request.body().method_title

      const DQ = await DM.save()
      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Created successfully!',
        result: DQ,
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
   * @update
   * @requestBody <PaymentMethod>
   */
  async update({ request, response }: HttpContext) {
    try {
      const DQ = await this.MODEL.findBy('id', request.param('id'))

      if (!DQ) {
        return response.notFound({
          code: HttpCodes.NOT_FOUND,
          message: 'Record does not exists!',
        })
      }

      const DE = await this.MODEL.findBy('method_title', request.body().method_title)

      if (DE) {
        return response.conflict({
          code: HttpCodes.CONFLICTS,
          message: 'Record already exists!',
        })
      }

      DQ.method_title = request.body().method_title

      await DQ.save()
      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Update successfully!',
        result: DQ,
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
   * @updateStatus
   * @requestBody {"status":"false"}
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

  async destroy({ request, response }: HttpContext) {
    const DQ = await this.MODEL.findBy('id', request.param('id'))

    if (!DQ) {
      return response.notFound({
        code: HttpCodes.NOT_FOUND,
        message: 'Record not found',
      })
    }

    await DQ.delete()
    return response.ok({
      code: HttpCodes.SUCCESS,
      message: 'Record deleted successfully!',
    })
  }
}
