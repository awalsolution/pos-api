import BaseController from '#controllers/base_controller'
import { HttpContext } from '@adonisjs/core/http'
import HttpCodes from '#enums/http_codes'
import Product from '#models/product'

export default class ProductController extends BaseController {
  declare MODEL: typeof Product
  constructor() {
    super()
    this.MODEL = Product
  }

  /**
   * @findAllRecords
   * @paramUse(paginated)
   */
  async findAllRecords({ request, response }: HttpContext) {
    try {
      let DQ = this.MODEL.query()

      const page = request.input('page')
      let perPage = request.input('perPage')

      if (!perPage) {
        return response.badRequest({
          code: HttpCodes.BAD_REQUEST,
          message: 'perPage parameter is required',
        })
      }

      const data = await DQ.preload('product_attribute', (qs) => qs.select(['name', 'option']))
        .preload('shop', (sq) => sq.select(['shop_name']))
        .preload('category')
        .preload('gallery', (gq) => gq.select(['url']))
        .preload('variants', (vq) => vq.preload('gallery', (gsubq) => gsubq.select(['url'])))
        .paginate(page, perPage)

      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Records found successfully!',
        result: data,
      })
    } catch (error) {
      return response.internalServerError({
        code: HttpCodes.SERVER_ERROR,
        message: 'An error occurred while processing the request',
      })
    }
  }

  async findSingleRecord({ request, response }: HttpContext) {
    try {
      const DQ = await this.MODEL.query()
        .where('id', request.param('product_id'))
        .preload('shop', (qs) => qs.select(['shop_name']))
        .preload('gallery', (q) => q.select(['url']))
        .preload('category')
        .preload('product_attribute', (qs) => qs.select(['name', 'option']))
        .preload('variants', (q) => q.preload('gallery', (qs) => qs.select(['url'])))
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
}
