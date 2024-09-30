import { HttpContext } from '@adonisjs/core/http'
import { BaseController } from '#controllers/base_controller'
import logger from '@adonisjs/core/services/logger'
import User from '#models/user'

export default class UserController extends BaseController {
  async index({ auth, request, response }: HttpContext) {
    try {
      const currentUser = auth.user!
      let DQ = User.query().whereNotIn('id', [currentUser.id, 1])

      const page = request.input('page')
      const perPage = request.input('perPage')

      if (request.input('email')) {
        DQ = DQ.whereILike('email', request.input('email') + '%')
      }
      if (request.input('name')) {
        DQ = DQ.whereILike('name', request.input('name') + '%')
      }
      if (request.input('phone')) {
        DQ = DQ.whereILike('phone_number', request.input('phone') + '%')
      }

      if (!DQ) {
        return response.notFound({
          code: 400,
          message: 'Data not found',
        })
      }

      if (perPage) {
        return response.ok({
          code: 200,
          data: await DQ.preload('permissions')
            .preload('roles', (PQ) => {
              PQ.preload('permissions')
            })
            .orderBy('created_at', 'desc')
            .paginate(page, perPage),
          message: 'Record find successfully!',
        })
      } else {
        return response.ok({
          code: 200,
          message: 'Record find successfully!',
          data: await DQ.preload('permissions')
            .preload('roles', (PQ) => {
              PQ.preload('permissions')
            })
            .orderBy('created_at', 'desc'),
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
      const DQ = await User.query()
        .where('id', request.param('id'))
        .preload('permissions')
        .preload('roles', (RQ) => {
          RQ.where('name', '!=', 'super admin').preload('permissions')
        })
        .first()

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
      let DE = await User.findBy('email', request.body().email)
      if (DE) {
        delete DE.$attributes.password

        return response.conflict({
          code: 409,
          message: 'Record already exists!',
        })
      }

      const DM = new User()

      DM.name = request.body().name
      DM.email = request.body().email
      DM.password = request.body().password
      DM.status = request.body().status
      DM.created_by = currentUser?.name

      const DQ = await DM.save()
      DQ.related('roles').sync(request.body().roles)

      delete DM.$attributes.password
      logger.info(`User with email: ${DQ.email} is created Successfully!`)
      return response.ok({
        code: 200,
        message: 'Created successfully!',
        result: DM,
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
      const DQ = await User.findBy('id', request.param('id'))
      if (!DQ) {
        return response.notFound({
          code: 400,
          message: 'Data not found',
        })
      }
      const DE = await User.query()
        .where('email', 'like', request.body().email)
        .whereNot('id', request.param('id'))
        .first()

      if (DE) {
        return response.conflict({
          code: 409,
          message: 'Already exist!',
        })
      }

      DQ.name = request.body().name
      DQ.email = request.body().email
      DQ.phone_number = request.body().phone_number
      DQ.status = request.body().status
      DQ.address = request.body().address
      DQ.city = request.body().city
      DQ.state = request.body().state
      DQ.country = request.body().country
      DQ.profile_picture = request.body().profile_picture
      DQ.created_by = currentUser?.name

      DQ.related('roles').sync(request.body().roles)

      delete DQ.$attributes.password
      await DQ.save()
      logger.info(`User with email: ${DQ.email} is updated Successfully!`)
      return response.ok({
        code: 200,
        message: 'Update successfully!',
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

  async assignPermission({ request, response }: HttpContext) {
    try {
      const DQ = await User.findBy('id', request.param('id'))
      if (!DQ) {
        return response.notFound({
          code: 400,
          message: 'Data not found',
        })
      }

      await DQ.save()

      DQ.related('permissions').sync(request.body().permissions)
      logger.info(`Permissions Assign to ${DQ.name} Successfully!`)
      return response.ok({
        code: 200,
        message: 'Assigned successfully!',
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

  async profileUpdate({ auth, request, response }: HttpContext) {
    try {
      const currentUser = auth.user!
      const DQ = await User.findBy('id', request.param('id'))
      if (!DQ) {
        return response.notFound({
          code: 400,
          message: 'Data not found',
        })
      }

      DQ.name = request.body().name
      DQ.phone_number = request.body().phone_number
      DQ.address = request.body().address
      DQ.city = request.body().city
      DQ.state = request.body().state
      DQ.country = request.body().country
      DQ.profile_picture = request.body().profile_picture
      DQ.created_by = currentUser?.name

      await DQ.save()
      logger.info(`${DQ.name} profile is updated Successfully!`)
      return response.ok({
        code: 200,
        message: 'Update successfully!',
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

  async updateStatus({ request, response }: HttpContext) {
    try {
      const DQ = await User.findBy('id', request.param('id'))
      if (!DQ) {
        return response.notFound({
          code: 400,
          message: 'Data not found!',
        })
      }

      DQ.status = request.body().status

      await DQ.save()
      logger.info(`${DQ.name} status is updated Successfully!`)
      return response.ok({
        code: 200,
        message: 'Update successfully!',
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

  async destroy({ request, response }: HttpContext) {
    try {
      const DQ = await User.findBy('id', request.param('id'))
      if (!DQ) {
        return response.notFound({
          code: 400,
          message: 'Data not found',
        })
      }
      await DQ.delete()
      logger.info(`${DQ.name} is deleted Successfully!`)
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
