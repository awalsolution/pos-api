import BaseController from '#controllers/base_controller'
import { HttpContext } from '@adonisjs/core/http'
import HttpCodes from '#enums/http_codes'
import Variant from '#models/variant'

export default class VariantController extends BaseController {
  declare MODEL: typeof Variant
  constructor() {
    super()
    this.MODEL = Variant
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
        result: await DQ.preload('products')
          .preload('attributes')
          .preload('images')
          .paginate(page, perPage),
        message: 'Record find successfully!',
      })
    } else {
      return response.ok({
        code: HttpCodes.SUCCESS,
        result: await DQ.preload('products').preload('attributes').preload('images'),
        message: 'Record find successfully!',
      })
    }
  }

  async findSingleRecord({ request, response }: HttpContext) {
    try {
      const DQ = await this.MODEL.query()
        .where('id', request.param('id'))
        .preload('products')
        .preload('attributes')
        .preload('images')
        .first()

      if (!DQ) {
        return response.notFound({
          code: HttpCodes.NOT_FOUND,
          message: 'Data is Empty',
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

  async getVariantsByProduct({ request, response }: HttpContext) {
    try {
      const DQ = await this.MODEL.query()
        .where('product_id', request.param('id'))
        .preload('attributes')
        .preload('images')

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
   * @requestBody <Variant>
   */
  async create({ request, response }: HttpContext) {
    try {
      const DE = await this.MODEL.findBy('sku_id', request.body().sku_id)

      if (DE) {
        return response.conflict({
          code: HttpCodes.CONFLICTS,
          message: 'Record already exists!',
        })
      }

      const DM = new this.MODEL()
      DM.productId = request.param('id')
      DM.attributeId = request.body().attribute_id
      DM.sku_id = request.body().sku_id
      DM.attribute_value = request.body().attribute_value
      DM.price = request.body().price
      DM.regular_price = request.body().regular_price
      DM.status = request.body().status
      DM.stock_quantity = request.body().stock_quantity
      DM.stock_status = request.body().stock_status
      DM.rating = request.body().rating

      await DM.save()
      const images = request.body().images
      for (const image of images) {
        await DM.related('images').create(image)
      }

      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Created successfully!',
        result: DM,
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
   * @requestBody <Variant>
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
      DQ.sku_id = request.body().sku_id
      DQ.attribute_value = request.body().attribute_value
      DQ.price = request.body().price
      DQ.regular_price = request.body().regular_price
      DQ.status = request.body().status
      DQ.stock_quantity = request.body().stock_quantity
      DQ.stock_status = request.body().stock_status
      DQ.rating = request.body().rating
      await DQ.save()
      const images = request.body().images
      for (const image of images) {
        if (image.id) {
          const existImg = await DQ.related('images').query().where('id', image.id).first()

          if (existImg) {
            // update image
            existImg.merge(image)
          }
        } else {
          // Create new image
          await DQ.related('images').create(image)
        }
      }
      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Update successfully!',
        result: DQ,
      })
    } catch (e) {
      console.log(e)
      return response.internalServerError({
        code: HttpCodes.SERVER_ERROR,
        message: e.message,
      })
    }
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
