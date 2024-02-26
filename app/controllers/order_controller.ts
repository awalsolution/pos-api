import BaseController from '#controllers/base_controller'
import { HttpContext } from '@adonisjs/core/http'
import HttpCodes from '#enums/http_codes'
import Order from '#models/order'

export default class OrderController extends BaseController {
  declare MODEL: typeof Order
  constructor() {
    super()
    this.MODEL = Order
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
        message: 'Data is Empty',
      })
    }

    if (perPage) {
      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Record find Successfully',
        result: await DQ.paginate(page, perPage),
      })
    } else {
      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Record find Successfully',
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
          message: 'Data is Empty',
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
   * @requestBody <Order>
   */
  async create({ request, response }: HttpContext) {
    try {
      const DE = await this.MODEL.findBy('order_key', request.body().order_key)

      if (DE) {
        return response.conflict({
          code: HttpCodes.CONFLICTS,
          message: `Record: "${request.body().order_key}" already exists!`,
        })
      }

      const DM = new this.MODEL()

      DM.user_id = request.body().user_id
      DM.shipment_address_id = request.body().shipment_address_id
      DM.payment_method_id = request.body().payment_method_id
      DM.total = request.body().total
      DM.order_key = request.body().order_key

      const DQ = await DM.save()

      DM.related('order_items').createMany(request.body().order_items)

      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Created Successfully!',
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
   * @requestBody <Order>
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

      DQ.user_id = request.body().user_id
      DQ.shipment_address_id = request.body().shipment_address_id
      DQ.payment_method_id = request.body().payment_method_id
      DQ.total = request.body().total
      DQ.order_key = request.body().order_key
      DQ.status = request.body().status

      await DQ.save()
      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Update Successfully!',
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
      message: 'Record deleted successfully',
    })
  }
}
