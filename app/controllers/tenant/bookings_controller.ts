import { DateTime } from 'luxon'
import { HttpContext } from '@adonisjs/core/http'
import Bookings from '#models/tenant/bookings'

export default class BookingsController {
  async index({ request, response }: HttpContext) {
    let DQ = Bookings.query()

    const page = request.input('page')
    const perPage = request.input('perPage')

    if (request.input('name')) {
      DQ = DQ.whereILike('customer_name', request.input('name') + '%')
    }

    if (perPage) {
      return response.ok({
        code: 200,
        data: await DQ.paginate(page, perPage),
        message: 'Record find successfully!',
      })
    } else {
      return response.ok({
        code: 200,
        data: await DQ,
        message: 'Record find successfully!',
      })
    }
  }

  async create({ request, response }: HttpContext) {
    try {
      const DM = new Bookings()
      DM.customerName = request.body().customer_name
      DM.status = request.body().status
      DM.group_no = request.body().group_no
      DM.group_name = request.body().group_name
      DM.category = request.body().category
      DM.approvalDate = DateTime.fromJSDate(new Date(request.body().approval_date))
      DM.expectedDeparture = DateTime.fromJSDate(new Date(request.body().expected_departure))
      await DM.save()

      const DQ = await DM.save()
      return response.ok({
        code: 200,
        message: 'Created successfully!',
        data: DQ,
      })
    } catch (e) {
      console.log(e)
      return response.internalServerError({
        code: 500,
        message: e.toString(),
      })
    }
  }
  async show({ request, response }: HttpContext) {
    try {
      const DQ = await Bookings.query().where('id', request.param('id')).first()

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

  async destroy({ request, response }: HttpContext) {
    const DQ = await Bookings.findBy('id', request.param('id'))
    if (!DQ) {
      return response.notFound({
        code: 400,
        message: 'Data not found',
      })
    }
    await DQ.delete()
    return response.ok({
      code: 200,
      message: 'Deleted successfully!',
    })
  }
}
