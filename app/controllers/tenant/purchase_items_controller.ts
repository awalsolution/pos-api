import { HttpContext } from '@adonisjs/core/http'
import PurchaseItem from '#models/tenant/purchase_item'
import logger from '@adonisjs/core/services/logger'

export default class PurchasesItemsController {
  async index({ request, response }: HttpContext) {
    try {
      const DQ = await PurchaseItem.query()
        .preload('products')
        .orderBy('created_at', 'desc')
        .where('purchase_id', request.param('id'))

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
   * @requestBody <PurchaseItem>
   */
  async create({ request, response }: HttpContext) {
    try {
      const purcaseId = request.param('id')
      const data: any = request.body().purchase_items

      for (const item of data) {
        if (item.id) {
          const DQ = await PurchaseItem.findBy('id', item.id)
          if (!DQ) {
            return response.notFound({
              code: 400,
              message: 'Data does not exists!',
            })
          }

          DQ.productId = item.products.id
          DQ.ordered_qty = item.ordered_qty
          DQ.cost_price = item.cost_price
          DQ.list_price = item.list_price
          DQ.sale_price = item.sale_price
          DQ.total_amount = item.ordered_qty * item.cost_price

          await DQ.save()

          logger.info(`Purchase Item with id:${DQ.id} is updated successfully!`)
        } else {
          const DM = new PurchaseItem()
          DM.purchaseId = purcaseId
          DM.productId = item.products.id
          DM.ordered_qty = item.ordered_qty
          DM.cost_price = item.cost_price
          DM.list_price = item.list_price
          DM.sale_price = item.sale_price
          DM.total_amount = item.ordered_qty * item.cost_price
          const DQ = await DM.save()
          logger.info(`Purchase Item with id:${DQ.id} is created successfully!`)
        }
      }

      return response.ok({
        code: 200,
        message: 'Created successfully!',
        data: null,
      })
    } catch (e) {
      console.log('error', e.toString())
      return response.internalServerError({
        code: 500,
        message: e.toString(),
      })
    }
  }

  async destroy({ request, response }: HttpContext) {
    try {
      const DQ = await PurchaseItem.findBy('id', request.param('id'))
      if (!DQ) {
        return response.notFound({
          code: 400,
          message: 'Data not found',
        })
      }
      await DQ.delete()
      logger.info(`Purchase Item with id:${DQ.id} is deleted successfully!`)
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
