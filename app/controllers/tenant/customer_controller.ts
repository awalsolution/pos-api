import { HttpContext } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'
import Customer from '#models/tenant/customer'

export default class CustomersController {
  async index({ request, response }: HttpContext) {
    try {
      let DQ = Customer.query()

      const page = request.input('page')
      const perPage = request.input('perPage')

      let data

      if (perPage) {
        data = await DQ.preload('address')
          .preload('auther')
          .preload('metadata')
          .orderBy('created_at', 'desc')
          .paginate(page, perPage)
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
      const DQ = await Customer.query()
        .preload('auther')
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

      DM.userId = currentUser?.id
      DM.name = request.body().name
      DM.email = request.body().email
      DM.contact = request.body().contact
      DM.phone = request.body().phone
      DM.notes = request.body().notes
      DM.max_credit = request.body().max_credit
      DM.tex_category = request.body().tex_category
      DM.status = request.body().status

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
      const DQ = await Customer.query().preload('address').where('id', request.param('id')).first()

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

      DQ.userId = currentUser?.id
      DQ.name = request.body().name
      DQ.email = request.body().email
      DQ.contact = request.body().contact
      DQ.phone = request.body().phone
      DQ.notes = request.body().notes
      DQ.max_credit = request.body().max_credit
      DQ.tex_category = request.body().tex_category
      DQ.status = request.body().status

      await DQ.save()

      if (request.body().address) {
        DQ.related('address').updateOrCreate(
          { id: request.body().address.id },
          {
            street: request.body().address.street,
            city: request.body().address.city,
            state: request.body().address.state,
            zip: request.body().address.zip,
            country: request.body().address.country,
            type: request.body().address.type,
          }
        )
      }

      if (request.body().same_as) {
        DQ.related('address').updateOrCreate(
          { id: request.body().billing.id },
          {
            street: request.body().address.street,
            city: request.body().address.city,
            state: request.body().address.state,
            zip: request.body().address.zip,
            country: request.body().address.country,
            type: 'billing',
          }
        )
      } else {
        DQ.related('address').updateOrCreate(
          { id: request.body().billing.id },
          {
            street: request.body().billing.street,
            city: request.body().billing.city,
            state: request.body().billing.state,
            zip: request.body().billing.zip,
            country: request.body().billing.country,
            type: request.body().billing.type,
          }
        )
      }

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
