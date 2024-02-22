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
  async findAllRecords({ auth, request, response }: HttpContext) {
    const currentUser = auth.use('api').user!
    let DQ = this.MODEL.query()

    const page = request.input('page')
    const perPage = request.input('perPage')

    // name filter
    if (request.input('name')) {
      DQ = DQ.whereILike('title', request.input('name') + '%')
    }

    // fetched products with related shops
    if (!this.isSuperAdmin(currentUser)) {
      DQ = DQ.where('shop_id', currentUser.shopId!)
    }

    if (perPage) {
      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Products find Successfully',
        result: await DQ.preload('shop').paginate(page, perPage),
      })
    } else {
      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Products find Successfully',
        result: await DQ.preload('shop'),
      })
    }
  }

  // find Product using id
  async findSingleRecord({ request, response }: HttpContext) {
    try {
      const DQ = await this.MODEL.query().where('id', request.param('id')).preload('shop').first()

      if (!DQ) {
        return response.notFound({
          code: HttpCodes.NOT_FOUND,
          message: 'Product Data is Empty',
        })
      }

      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Product find Successfully',
        result: DQ,
      })
    } catch (e) {
      return response.internalServerError({
        code: HttpCodes.SERVER_ERROR,
        message: e.toString(),
      })
    }
  }

  // create new product
  async create({ auth, request, response }: HttpContext) {
    const currentUser = auth.use('api').user!
    try {
      const DE = await this.MODEL.findBy('product_code', request.body().product_code)
      if (DE) {
        return response.conflict({
          code: HttpCodes.CONFLICTS,
          message: 'Product already exists!',
        })
      }
      const DM = new this.MODEL()
      DM.shopId = currentUser.shop.id
      DM.categoryId = request.body().category_id
      DM.product_code = request.body().product_code
      DM.title = request.body().title
      DM.description = request.body().description
      DM.status = request.body().status
      DM.product_image = request.body().product_image

      await DM.save()

      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Product Created Successfully!',
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

  // update product using id
  async update({ request, response }: HttpContext) {
    try {
      const DQ = await this.MODEL.findBy('id', request.param('id'))

      if (!DQ) {
        return response.notFound({
          code: HttpCodes.NOT_FOUND,
          message: 'Product does not exists!',
        })
      }

      DQ.title = request.body().title
      DQ.categoryId = request.body().category_id
      DQ.product_code = request.body().product_code
      DQ.description = request.body().description
      DQ.status = request.body().status
      DQ.product_image = request.body().product_image

      await DQ.save()

      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Product updated successfully!',
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

  // delete product using id
  async destroy({ request, response }: HttpContext) {
    const DQ = await this.MODEL.findBy('id', request.param('id'))

    if (!DQ) {
      return response.notFound({
        code: HttpCodes.NOT_FOUND,
        message: 'Product not found',
      })
    }

    await DQ.delete()
    return response.ok({
      code: HttpCodes.SUCCESS,
      message: 'Record deleted successfully',
    })
  }
}
