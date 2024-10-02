import { HttpContext } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'
import Customer from '#models/tenant/customer'

export default class CustomersController {
  async index({ request, response }: HttpContext) {
    let DQ = Customer.query()

    const page = request.input('page')
    const perPage = request.input('perPage')

    if (request.input('name')) {
      DQ = DQ.whereILike('name', request.input('name') + '%')
    }

    if (perPage) {
      return response.ok({
        code: 200,
        data: await DQ.preload('address')
          .preload('metadata')
          .orderBy('created_at', 'desc')
          .paginate(page, perPage),
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
      const DQ = await Customer.query()
        .preload('address')
        .preload('metadata')
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
      const DE = await Customer.findBy('name', request.body().name)

      if (DE) {
        return response.conflict({
          code: 409,
          message: 'Already exists!',
        })
      }

      const DM = new Customer()

      DM.name = request.body().name
      DM.email = request.body().email
      DM.contact = request.body().contact
      DM.phone = request.body().phone
      DM.notes = request.body().notes
      DM.max_credit = request.body().max_credit
      DM.tex_category = request.body().tex_category
      DM.status = request.body().status
      DM.created_by = currentUser?.name

      const DQ = await DM.save()

      DQ.related('address').create(request.body().address)
      if (request.body().same_as) {
        DQ.related('address').create({ ...request.body().address, type: 'billing' })
      } else {
        DQ.related('address').create({ ...request.body().billing, type: 'billing' })
      }
      logger.info(`Customer ${DQ.name} is created successfully!`)

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
      const DQ = await Customer.findBy('id', request.param('id'))

      if (!DQ) {
        return response.notFound({
          code: 400,
          message: 'Data does not exists!',
        })
      }
      const DE = await Customer.query()
        .where('name', 'like', request.body().name)
        .whereNot('id', request.param('id'))
        .first()

      if (DE) {
        return response.conflict({
          code: 409,
          message: 'Already exist!',
        })
      }

      DQ.name = request.body().name
      DQ.email = request.body().email
      DQ.contact = request.body().contact
      DQ.phone = request.body().phone
      DQ.notes = request.body().notes
      DQ.max_credit = request.body().max_credit
      DQ.tex_category = request.body().tex_category
      DQ.status = request.body().status
      DQ.created_by = currentUser?.name

      await DQ.save()

      logger.info(`Customer ${DQ.name} is updated successfully!`)

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
      const DQ = await Customer.findBy('id', request.param('id'))
      if (!DQ) {
        return response.notFound({
          code: 400,
          message: 'Data not found',
        })
      }
      await DQ.delete()
      logger.info(`Customer ${DQ.name} is deleted successfully!`)

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