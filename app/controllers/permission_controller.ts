import { HttpContext } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'
import Permission from '#models/permission'

export default class PermissionController {
  async index({ request, response }: HttpContext) {
    try {
      let DQ = Permission.query()

      const page = request.input('page')
      const perPage = request.input('perPage')

      // name filter
      if (request.input('name')) {
        DQ = DQ.whereILike('name', request.input('name') + '%')
      }

      if (request.input('type')) {
        DQ = DQ.whereILike('type', request.input('type') + '%')
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
          data: await DQ.orderBy('created_at', 'desc').select('*'),
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
      const DQ = await Permission.findBy('id', request.param('id'))
      if (!DQ) {
        return response.notFound({
          code: 400,
          message: 'Data does not exists!',
          data: null,
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
      const DE = await Permission.findBy('name', request.body().name)
      if (DE) {
        return response.conflict({
          code: 409,
          message: 'Already exists!',
        })
      }
      const DM = new Permission()

      DM.name = request.body().name
      DM.type = request.body().type
      DM.status = request.body().status
      DM.created_by = currentUser?.name

      const DQ = await DM.save()
      logger.info(`Permission ${DQ.name} is created successfully!`)
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
      const DQ = await Permission.findBy('id', request.param('id'))
      if (!DQ) {
        return response.notFound({
          code: 400,
          message: 'Data does not exists!',
        })
      }
      const permissionExists = await Permission.query()
        .where('name', 'like', request.body().name)
        .whereNot('id', request.param('id'))
        .first()

      if (permissionExists) {
        return response.conflict({
          code: 409,
          message: 'Already exist!',
        })
      }

      DQ.name = request.body().name
      DQ.type = request.body().type
      DQ.status = request.body().status
      DQ.created_by = currentUser?.name

      await DQ.save()
      logger.info(`Permission ${DQ.name} is updated successfully!`)
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
      const DQ = await Permission.findBy('id', request.param('id'))
      if (!DQ) {
        return response.notFound({
          code: 400,
          message: 'Data not found',
        })
      }
      await DQ.delete()
      logger.info(`Permission ${DQ.name} is deleted successfully!`)
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
