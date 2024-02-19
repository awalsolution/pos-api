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

  // find shop list
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
        message: 'Shops Data is Empty',
      })
    }

    if (perPage) {
      return response.ok({
        code: HttpCodes.SUCCESS,
        result: await DQ.paginate(page, perPage),
        message: 'Shops find Successfully',
      })
    } else {
      return response.ok({
        code: HttpCodes.SUCCESS,
        result: await DQ.select('*'),
        message: 'Shops find Successfully',
      })
    }
  }

  // find Shop using id
  async findSingleRecord({ request, response }: HttpContext) {
    try {
      const DQ = await this.MODEL.query().where('id', request.param('id')).first()

      if (!DQ) {
        return response.notFound({
          code: HttpCodes.NOT_FOUND,
          message: 'Shop Data is Empty',
        })
      }

      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Shop find successfully',
        result: DQ,
      })
    } catch (e) {
      return response.internalServerError({
        code: HttpCodes.SERVER_ERROR,
        message: e.toString(),
      })
    }
  }

  // create new shop
  async create({ request, response }: HttpContext) {
    try {
      const DE = await this.MODEL.findBy('shop_name', request.body().shop_name)

      if (DE) {
        return response.conflict({
          code: HttpCodes.CONFLICTS,
          message: `Shop: "${request.body().shop_name}" already exists!`,
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
        message: `Shop: "${request.body().shop_name}" Created Successfully!`,
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

  // update shop using id
  async update({ request, response }: HttpContext) {
    try {
      const DQ = await this.MODEL.findBy('id', request.param('id'))
      if (!DQ) {
        return response.notFound({
          code: HttpCodes.NOT_FOUND,
          message: 'Shop does not exists!',
        })
      }
      const DE = await this.MODEL.query()
        .where('shop_name', 'like', request.body().shop_name)
        .whereNot('id', request.param('id'))
        .first()

      if (DE) {
        return response.conflict({
          code: HttpCodes.CONFLICTS,
          message: `Shop: "${request.body().shop_name}" already exists!`,
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
        message: `Shop: "${request.body().shop_name}" Update Successfully!`,
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

  // delete shop using id
  async destroy({ request, response }: HttpContext) {
    const DQ = await this.MODEL.findBy('id', request.param('id'))
    if (!DQ) {
      return response.notFound({
        code: HttpCodes.NOT_FOUND,
        message: 'Shop not found',
      })
    }
    await DQ.delete()
    return response.ok({
      code: HttpCodes.SUCCESS,
      result: { message: 'Shop deleted successfully' },
    })
  }
}
