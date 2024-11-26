import { HttpContext } from '@adonisjs/core/http'
import Product from '#models/tenant/product'
import logger from '@adonisjs/core/services/logger'

export default class ProductsController {
  async index({ request, response }: HttpContext) {
    let DQ = Product.query()

    const page = request.input('page')
    const perPage = request.input('perPage')

    if (request.input('name')) {
      DQ = DQ.whereILike('name', request.input('name') + '%')
    }

    if (perPage) {
      return response.ok({
        code: 200,
        data: await DQ.orderBy('created_at', 'desc').paginate(page, perPage),
        message: 'Record find successfully!',
      })
    } else {
      return response.ok({
        code: 200,
        data: await DQ.orderBy('created_at', 'desc'),
        message: 'Record find successfully!',
      })
    }
  }

  async show({ request, response }: HttpContext) {
    try {
      const DQ = await Product.query().where('id', request.param('id')).first()

      if (!DQ) {
        return response.notFound({
          code: 400,
          message: 'Data does not exists!',
        })
      }

      return response.ok({
        code: 200,
        message: 'Record find successfully!',
        data: DQ,
      })
    } catch (e) {
      return response.internalServerError({
        code: 500,
        message: e.toString(),
      })
    }
  }

  /**
   * @create
   * @requestBody <Product>
   */
  async create({ auth, request, response }: HttpContext) {
    try {
      const currentUser = auth.user!
      const DE = await Product.findBy('name', request.body().name)

      if (DE) {
        return response.conflict({
          code: 409,
          message: 'Already exists!',
        })
      }

      const DM = new Product()

      DM.userId = currentUser?.id
      DM.productCategoryId = request.body().category_id
      DM.name = request.body().name
      DM.tax_able = request.body().tax_able
      DM.gst = request.body().name
      DM.serialized = request.body().serialized
      DM.status = request.body().status
      DM.weight = request.body().weight
      DM.description = request.body().description
      DM.base_price = request.body().base_price
      DM.list_price = request.body().list_price
      DM.discount = request.body().discount
      DM.reminder = request.body().reminder
      DM.location = request.body().location
      DM.min_qty = request.body().min_qty
      DM.target_qty = request.body().target_qty
      DM.manufacture = request.body().manufacture
      DM.thumbnail = request.body().thumbnail

      const DQ = await DM.save()

      if (request.body().product_codes) {
        const codes = request.body().product_codes
        for (const item of codes) {
          await DQ.related('product_codes').create({ code: item.code })
        }
      }

      if (request.body().product_images) {
        const images = request.body().product_images
        for (const item of images) {
          await DQ.related('product_images').create({ url: item.url })
        }
      }

      logger.info(`Product ${DQ.name} is created successfully!`)
      return response.ok({
        code: 200,
        message: 'Created successfully!',
        data: DQ,
      })
    } catch (e) {
      console.log('error', e.toString())
      return response.internalServerError({
        code: 500,
        message: e.toString(),
      })
    }
  }

  /**
   * @update
   * @requestBody <Product>
   */
  async update({ auth, request, response }: HttpContext) {
    try {
      const currentUser = auth.user!
      const DQ = await Product.findBy('id', request.param('id'))
      if (!DQ) {
        return response.notFound({
          code: 400,
          message: 'Data does not exists!',
        })
      }
      const DE = await Product.query()
        .where('name', 'like', request.body().name)
        .whereNot('id', request.param('id'))
        .first()

      if (DE) {
        return response.conflict({
          code: 409,
          message: 'Already exist!',
        })
      }

      DQ.userId = currentUser?.id
      DQ.productCategoryId = request.body().category_id
      DQ.name = request.body().name
      DQ.tax_able = request.body().tax_able
      DQ.gst = request.body().name
      DQ.serialized = request.body().serialized
      DQ.status = request.body().status
      DQ.weight = request.body().weight
      DQ.description = request.body().description
      DQ.base_price = request.body().base_price
      DQ.list_price = request.body().list_price
      DQ.discount = request.body().discount
      DQ.reminder = request.body().reminder
      DQ.location = request.body().location
      DQ.min_qty = request.body().min_qty
      DQ.target_qty = request.body().target_qty
      DQ.manufacture = request.body().manufacture
      DQ.thumbnail = request.body().thumbnail

      await DQ.save()
      logger.info(`Product ${DQ.name} is updated successfully!`)
      return response.ok({
        code: 200,
        message: 'Updated successfully!',
        data: DQ,
      })
    } catch (e) {
      console.log('error', e.toString())
      return response.internalServerError({
        code: 500,
        message: e.message,
      })
    }
  }

  async destroy({ request, response }: HttpContext) {
    try {
      const DQ = await Product.findBy('id', request.param('id'))
      if (!DQ) {
        return response.notFound({
          code: 400,
          message: 'Data not found',
        })
      }
      await DQ.delete()
      logger.info(`Product ${DQ.name} is deleted successfully!`)
      return response.ok({
        code: 200,
        message: 'Deleted successfully!',
      })
    } catch (e) {
      console.log('error', e.toString())
      return response.internalServerError({
        code: 500,
        message: e.toString(),
      })
    }
  }
}
