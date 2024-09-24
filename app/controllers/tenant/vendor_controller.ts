import { HttpContext } from '@adonisjs/core/http'
import Vendor from '#models/vendor'
import logger from '@adonisjs/core/services/logger'

export default class RoleController {
  async index({ request, response }: HttpContext) {
    let DQ = Vendor.query()

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
      const DQ = await Vendor.query().where('id', request.param('id')).preload('address').first()
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
      console.log(request.body())
      const currentUser = auth.user!
      const DE = await Vendor.findBy('name', request.body().name)

      if (DE) {
        return response.conflict({
          code: 409,
          message: 'Already exists!',
        })
      }

      const DM = new Vendor()
      DM.name = request.body().name
      DM.contact = request.body().contact
      DM.phone = request.body().phone
      DM.email = request.body().email
      DM.minOrder = request.body().min_order
      DM.pdFrightAmount = request.body().pd_fright_amount
      DM.shipVia = request.body().ship_via
      DM.defaulPoDays = request.body().defaul_po_days
      DM.created_by = currentUser?.name
      const DQ = await DM.save()

      DQ.related('address').create(request.body().shippingAddress)
      if (request.body().sameAsShipping) {
        DQ.related('address').create({ ...request.body().shippingAddress, type: 'mailing' })
      } else {
        DQ.related('address').create({ ...request.body().mailingAddress, type: 'mailing' })
      }
      logger.info(`Role ${DQ.name} is created successfully!`)
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
      const DM = await Vendor.findBy('id', request.param('id'))
      if (!DM) {
        return response.notFound({
          code: 400,
          message: 'Data does not exists!',
        })
      }
      const DE = await Vendor.query()
        .where('name', 'like', request.body().name)
        .whereNot('id', request.param('id'))
        .first()

      if (DE) {
        return response.conflict({
          code: 409,
          message: 'Already exist!',
        })
      }

      DM.name = request.body().name
      DM.contact = request.body().contact
      DM.phone = request.body().phone
      DM.email = request.body().email
      DM.minOrder = request.body().min_order
      DM.pdFrightAmount = request.body().pd_fright_amount
      DM.shipVia = request.body().shipVia
      DM.defaulPoDays = request.body().defaul_po_days
      DM.created_by = currentUser?.name

      await DM.save()
      logger.info(`Vendor ${DM.name} is updated successfully!`)
      return response.ok({
        code: 200,
        message: 'Updated successfully!',
        data: DM,
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
      const DQ = await Vendor.findBy('id', request.param('id'))
      if (!DQ) {
        return response.notFound({
          code: 400,
          message: 'Data not found',
        })
      }
      await DQ.delete()
      logger.info(`Role ${DQ.name} is deleted successfully!`)
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
