import { HttpContext } from '@adonisjs/core/http'
import Plan from '#models/plan'
import logger from '@adonisjs/core/services/logger'
import AllTenantInsertPermissionEvent from '#events/all_tenant_insert_permission_event'

export default class PlanController {
  async index({ request, response }: HttpContext) {
    try {
      let DQ = Plan.query()

      const page = request.input('page')
      const perPage = request.input('perPage')

      if (request.input('name')) {
        DQ = DQ.whereILike('name', request.input('name') + '%')
      }

      if (perPage) {
        return response.ok({
          code: 200,
          data: await DQ.orderBy('created_at', 'desc')
            .preload('permissions')
            .paginate(page, perPage),
          message: 'Record find successfully!',
        })
      } else {
        return response.ok({
          code: 200,
          data: await DQ.orderBy('created_at', 'desc').preload('tenants'),
          message: 'Record find successfully!',
        })
      }
    } catch (e) {
      console.log('error', e.toString())
      return response.internalServerError({
        code: 500,
        message: e.toString(),
      })
    }
  }

  async show({ request, response }: HttpContext) {
    try {
      const DQ = await Plan.query()
        .where('id', request.param('id'))
        .preload('permissions')
        .preload('tenants')
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
      console.log('error', e.toString())
      return response.internalServerError({
        code: 500,
        message: e.toString(),
      })
    }
  }

  async create({ auth, request, response }: HttpContext) {
    try {
      const currentUser = auth.user!
      const DE = await Plan.findBy('name', request.body().name)

      if (DE) {
        return response.conflict({
          code: 409,
          message: 'Already exists!',
        })
      }

      const DM = new Plan()

      DM.name = request.body().name
      DM.type = request.body().type
      DM.price = request.body().price
      DM.description = request.body().description
      DM.status = request.body().status
      DM.created_by = currentUser?.name

      const DQ = await DM.save()
      logger.info(`Plan ${DQ.name} is created successfully!`)
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
      const DQ = await Plan.findBy('id', request.param('id'))
      if (!DQ) {
        return response.notFound({
          code: 400,
          message: 'Data does not exists!',
        })
      }
      const DE = await Plan.query()
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
      DQ.type = request.body().type
      DQ.price = request.body().price
      DQ.description = request.body().description
      DQ.status = request.body().status
      DQ.created_by = currentUser?.name

      await DQ.save()
      logger.info(`Plan ${DQ.name} is updated successfully!`)
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

  async assignPermission({ request, response }: HttpContext) {
    try {
      const DQ = await Plan.findBy('id', request.param('id'))
      if (!DQ) {
        return response.notFound({
          code: 400,
          message: 'Data does not exists!',
        })
      }

      await DQ.related('permissions').sync(request.body().permissions)
      // permission insert event
      AllTenantInsertPermissionEvent.dispatch({
        plan_id: DQ.id,
        permissions: request.body().permissions,
      })
      logger.info(`Permissions Assign to ${DQ.name} successfully!`)

      return response.ok({
        code: 200,
        message: 'Assign successfully!',
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
      const DQ = await Plan.findBy('id', request.param('id'))
      if (!DQ) {
        return response.notFound({
          code: 400,
          message: 'Data not found',
        })
      }
      await DQ.delete()
      logger.info(`Plan ${DQ.name} is deleted successfully!`)
      return response.ok({
        code: 200,
        message: 'Deleted successfully!',
      })
    } catch (e) {
      console.log('error', e.toString())
      return response.internalServerError({
        code: 500,
        message: e.message,
      })
    }
  }
}
