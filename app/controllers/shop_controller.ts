import BaseController from '#controllers/base_controller'
import { HttpContext } from '@adonisjs/core/http'
import HttpCodes from '#enums/http_codes'
import Shop from '#models/shop'

export default class ShopController extends BaseController {
  declare MODEL: typeof Shop
  constructor() {
    super()
    this.MODEL = Shop
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
      DQ = DQ.whereILike('shop_name', request.input('name') + '%')
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
        result: await DQ.paginate(page, perPage),
        message: 'Record find successfully!',
      })
    } else {
      return response.ok({
        code: HttpCodes.SUCCESS,
        result: await DQ.select('*'),
        message: 'Record find successfully!',
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
        message: 'Record find successfully!',
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
   * @requestBody <Shop>
   */
  async create({ request, response }: HttpContext) {
    try {
      const DE = await this.MODEL.findBy('shop_name', request.body().shop_name)

      if (DE) {
        return response.conflict({
          code: HttpCodes.CONFLICTS,
          message: 'Record already exists!',
        })
      }

      const DM = new this.MODEL()
      DM.shop_name = request.body().shop_name
      DM.shop_phone = request.body().shop_phone
      DM.status = request.body().status
      DM.address = request.body().address
      DM.city = request.body().city
      DM.state = request.body().state
      DM.country = request.body().country
      DM.shop_logo = request.body().shop_logo

      const DQ = await DM.save()
      return response.ok({
        code: HttpCodes.SUCCESS,
        message: ' Created successfully!',
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
   * @requestBody <Shop>
   */
  async update({ request, response }: HttpContext) {
    try {
      const DQ = await this.MODEL.findBy('id', request.param('id'))
      if (!DQ) {
        return response.notFound({
          code: HttpCodes.NOT_FOUND,
          message: 'Data does not exists!',
        })
      }
      const DE = await this.MODEL.query()
        .where('shop_name', 'like', request.body().shop_name)
        .whereNot('id', request.param('id'))
        .first()

      if (DE) {
        return response.conflict({
          code: HttpCodes.CONFLICTS,
          message: 'Record already exists!',
        })
      }
      DQ.shop_name = request.body().shop_name
      DQ.shop_phone = request.body().shop_phone
      DQ.status = request.body().status
      DQ.address = request.body().address
      DQ.city = request.body().city
      DQ.state = request.body().state
      DQ.country = request.body().country
      DQ.shop_logo = request.body().shop_logo

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
