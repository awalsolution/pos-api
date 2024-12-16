import { HttpContext } from '@adonisjs/core/http'
import ProductCategory from '#models/tenant/product_category'
import logger from '@adonisjs/core/services/logger'

export default class ProductsCategoriesController {
  async index({ request, response }: HttpContext) {
    try {
      let DQ = ProductCategory.query()

      const page = request.input('page')
      const perPage = request.input('perPage')

      let data

      if (perPage) {
        data = await DQ.preload('auther').orderBy('created_at', 'desc').paginate(page, perPage)
      } else {
        data = await DQ.select('*').orderBy('created_at', 'desc')
      }

      return response.ok({
        code: 200,
        message: 'Record find Successfully',
        data: data,
      })
    } catch (e) {
      logger.error('something went wrong', e.toString())
      return response.internalServerError({
        code: 500,
        message: e.toString(),
      })
    }
  }

  async show({ request, response }: HttpContext) {
    try {
      const DQ = await ProductCategory.query()
        .preload('auther')
        .where('id', request.param('id'))
        .first()

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

  async create({ auth, request, response }: HttpContext) {
    try {
      const currentUser = auth.user!
      const DE = await ProductCategory.findBy('name', request.body().name)

      if (DE) {
        return response.conflict({
          code: 409,
          message: 'Already exists!',
        })
      }

      const DM = new ProductCategory()

      DM.userId = currentUser?.id
      DM.name = request.body().name
      DM.status = request.body().status
      DM.thumbnail = request.body().thumbnail

      const DQ = await DM.save()
      logger.info(`ProductCategory ${DQ.name} is created successfully!`)
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

  async update({ auth, request, response }: HttpContext) {
    try {
      const currentUser = auth.user!
      const DQ = await ProductCategory.findBy('id', request.param('id'))
      if (!DQ) {
        return response.notFound({
          code: 400,
          message: 'Data does not exists!',
        })
      }
      const DE = await ProductCategory.query()
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
      DQ.name = request.body().name
      DQ.status = request.body().status
      DQ.thumbnail = request.body().thumbnail

      await DQ.save()
      logger.info(`ProductCategory ${DQ.name} is updated successfully!`)
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
      const DQ = await ProductCategory.findBy('id', request.param('id'))
      if (!DQ) {
        return response.notFound({
          code: 400,
          message: 'Data not found',
        })
      }
      await DQ.delete()
      logger.info(`ProductCategory ${DQ.name} is deleted successfully!`)
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
