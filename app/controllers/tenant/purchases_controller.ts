import { HttpContext } from '@adonisjs/core/http'
import Purchase from '#models/tenant/purchase'
import logger from '@adonisjs/core/services/logger'

export default class PurchasesController {
  async index({ request, response }: HttpContext) {
    let DQ = Purchase.query()

    const page = request.input('page')
    const perPage = request.input('perPage')

    if (request.input('name')) {
      DQ = DQ.whereILike('invoice_no', request.input('name') + '%')
    }

    if (perPage) {
      return response.ok({
        code: 200,
        data: await DQ.preload('auther')
          .preload('supplier')
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
      const DQ = await Purchase.query()
        .preload('auther')
        .preload('supplier')
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

  /**
   * @create
   * @requestBody <Purchase>
   */
  async create({ auth, request, response }: HttpContext) {
    try {
      const currentUser = auth.user!
      const DE = await Purchase.findBy('invoice_no', request.body().invoice_no)

      if (DE) {
        return response.conflict({
          code: 409,
          message: 'Already exists!',
        })
      }

      const DM = new Purchase()

      DM.userId = currentUser?.id
      DM.supplierId = request.body().supplier_id
      DM.invoice_no = request.body().invoice_no
      DM.gst = request.body().gst
      DM.shipping_amount = request.body().shipping_amount
      DM.total_items = request.body().total_items
      DM.total_qty = request.body().total_qty
      DM.total_amount = request.body().total_amount
      DM.notes = request.body().notes
      DM.notes = request.body().notes

      const DQ = await DM.save()
      logger.info(`Purchase ${DQ.invoice_no} is created successfully!`)
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
      const DQ = await Purchase.findBy('id', request.param('id'))
      if (!DQ) {
        return response.notFound({
          code: 400,
          message: 'Data does not exists!',
        })
      }
      const DE = await Purchase.query()
        .where('invoice_no', 'like', request.body().invoice_no)
        .whereNot('id', request.param('id'))
        .first()

      if (DE) {
        return response.conflict({
          code: 409,
          message: 'Already exist!',
        })
      }

      DQ.userId = currentUser?.id
      DQ.supplierId = request.body().supplier_id
      DQ.invoice_no = request.body().invoice_no
      DQ.gst = request.body().gst
      DQ.shipping_amount = request.body().shipping_amount
      DQ.total_items = request.body().total_items
      DQ.total_qty = request.body().total_qty
      DQ.total_amount = request.body().total_amount
      DQ.notes = request.body().notes
      DQ.notes = request.body().notes
      DQ.status = request.body().status

      await DQ.save()
      logger.info(`Purchase ${DQ.invoice_no} is updated successfully!`)
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
      const DQ = await Purchase.findBy('id', request.param('id'))
      if (!DQ) {
        return response.notFound({
          code: 400,
          message: 'Data not found',
        })
      }
      await DQ.delete()
      logger.info(`Purchase ${DQ.invoice_no} is deleted successfully!`)
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
