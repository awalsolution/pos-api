import { HttpContext } from '@adonisjs/core/http'
import Purchase from '#models/tenant/purchase'
import logger from '@adonisjs/core/services/logger'

export default class PurchasesController {
  async index({ request, response }: HttpContext) {
    try {
      let DQ = Purchase.query()

      const page = request.input('page')
      const perPage = request.input('perPage')

      let data

      if (perPage) {
        data = await DQ.preload('auther')
          .preload('supplier')
          .preload('purchase_items')
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
      const DM = new Purchase()

      DM.userId = currentUser?.id
      DM.supplierId = request.body().supplier_id
      DM.notes = request.body().notes

      const DQ = await DM.save()

      logger.info(`Purchase with id:${DQ.id} is created successfully!`)
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

      DQ.userId = currentUser?.id
      DQ.supplierId = request.body().supplier_id
      DQ.invoice_no = request.body().invoice_no
      DQ.notes = request.body().notes

      await DQ.save()

      logger.info(`Purchase with id:${DQ.id} is updated successfully!`)
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
  // update status
  async updateStatus({ auth, request, response }: HttpContext) {
    try {
      const currentUser = auth.user!
      const DQ = await Purchase.findBy('id', request.param('id'))
      if (!DQ) {
        return response.notFound({
          code: 400,
          message: 'Data does not exists!',
        })
      }

      DQ.userId = currentUser?.id
      DQ.status = request.body().status

      await DQ.save()

      logger.info(`Purchase with id:${DQ.id} status:${DQ.status} is updated successfully!`)
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
