import { HttpContext } from '@adonisjs/core/http'
import Role from '#models/role'
import logger from '@adonisjs/core/services/logger'

export default class RoleController {
  async index({ request, response }: HttpContext) {
    let DQ = Role.query().whereNot('name', 'super admin')

    const page = request.input('page')
    const perPage = request.input('perPage')

    if (request.input('name')) {
      DQ = DQ.whereILike('name', request.input('name') + '%')
    }

    if (perPage) {
      return response.ok({
        code: 200,
        data: await DQ.preload('permissions').orderBy('created_at', 'desc').paginate(page, perPage),
        message: 'Record find successfully!',
      })
    } else {
      return response.ok({
        code: 200,
        data: await DQ.preload('permissions').orderBy('created_at', 'desc'),
        message: 'Record find successfully!',
      })
    }
  }

  async show({ request, response }: HttpContext) {
    try {
      const DQ = await Role.query().where('id', request.param('id')).preload('permissions').first()

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
      const DE = await Role.findBy('name', request.body().name)

      if (DE) {
        return response.conflict({
          code: 409,
          message: 'Already exists!',
        })
      }

      const DM = new Role()

      DM.name = request.body().name
      DM.status = request.body().status
      DM.created_by = currentUser?.name

      const DQ = await DM.save()
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
      const DQ = await Role.findBy('id', request.param('id'))
      if (!DQ) {
        return response.notFound({
          code: 400,
          message: 'Data does not exists!',
        })
      }
      const DE = await Role.query()
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
      DQ.status = request.body().status
      DQ.created_by = currentUser?.name

      await DQ.save()
      logger.info(`Role ${DQ.name} is updated successfully!`)
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
      const DQ = await Role.findBy('id', request.param('id'))
      if (!DQ) {
        return response.notFound({
          code: 400,
          message: 'Data does not exists!',
        })
      }

      await DQ.related('permissions').sync(request.body().permissions)
      await DQ.save()
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
      const DQ = await Role.findBy('id', request.param('id'))
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
