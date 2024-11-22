import { HttpContext } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'
import Supplier from '#models/tenant/supplier'

export default class SuppliersController {
  async index({ request, response }: HttpContext) {
    let DQ = Supplier.query()

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
      const DQ = await Supplier.query().where('id', request.param('id')).preload('address').first()
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
      const DE = await Supplier.findBy('name', request.body().name)

      if (DE) {
        return response.conflict({
          code: 409,
          message: 'Already exists!',
        })
      }

      const DM = new Supplier()
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
      logger.info(`Supplier ${DQ.name} is created successfully!`)
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
      const DM = await Supplier.query().preload('address').where('id', request.param('id')).first()
      if (!DM) {
        return response.notFound({
          code: 400,
          message: 'Data does not exists!',
        })
      }
      const DE = await Supplier.query()
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

      if (request.body().shipping_address) {
        DM.related('address').updateOrCreate(
          { id: request.body().shipping_address.id },
          {
            street: request.body().shipping_address.street,
            city: request.body().shipping_address.city,
            state: request.body().shipping_address.state,
            zip: request.body().shipping_address.zip,
            country: request.body().shipping_address.country,
            type: request.body().shipping_address.type,
          }
        )
      }

      if (request.body().same_as_shipping) {
        DM.related('address').updateOrCreate(
          { id: request.body().mailing_address.id },
          {
            street: request.body().shipping_address.street,
            city: request.body().shipping_address.city,
            state: request.body().shipping_address.state,
            zip: request.body().shipping_address.zip,
            country: request.body().shipping_address.country,
            type: 'mailing',
          }
        )
      } else {
        DM.related('address').updateOrCreate(
          { id: request.body().mailing_address.id },
          {
            street: request.body().mailing_address.street,
            city: request.body().mailing_address.city,
            state: request.body().mailing_address.state,
            zip: request.body().mailing_address.zip,
            country: request.body().mailing_address.country,
            type: request.body().mailing_address.type,
          }
        )
      }

      logger.info(`Supplier ${DM.name} is updated successfully!`)
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
      const DQ = await Supplier.findBy('id', request.param('id'))
      if (!DQ) {
        return response.notFound({
          code: 400,
          message: 'Data not found',
        })
      }
      await DQ.delete()
      logger.info(`Supplier ${DQ.name} is deleted successfully!`)
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