import { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { BaseController } from '#controllers/base_controller'

export default class UserController extends BaseController {
  async index({ auth, request, response }: HttpContext) {
    try {
      const currentUser = auth.user!
      let DQ = User.query().whereNotIn('id', [currentUser.id, 1])

      const page = request.input('page')
      const perPage = request.input('perPage')

      // name filter
      if (request.input('name')) {
        DQ = DQ.whereILike('email', request.input('name') + '%')
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
            .preload('profile')
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
            .preload('profile'),
        })
      }
    } catch (e) {
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
        .preload('profile')
        .first()

      return response.ok({
        code: 200,
        message: 'Record find successfully!',
        data: DQ,
      })
    } catch (e) {
      // console.log(e)
      return response.internalServerError({
        code: 500,
        message: e.toString(),
      })
    }
  }

  async create({ request, response }: HttpContext) {
    try {
      let DE = await User.findBy('email', request.body().email)
      if (DE && !DE.is_email_verified) {
        delete DE.$attributes.password

        return response.conflict({
          code: 409,
          message: 'Record already exists!',
        })
      }

      const DM = new User()

      DM.email = request.body().email
      DM.status = request.body().status
      DM.password = request.body().password

      await DM.save()

      DM.related('roles').sync(request.body().role_id)

      DM.related('profile').create({
        first_name: request.body().first_name,
        last_name: request.body().last_name,
        phone_number: request.body().phone_number,
      })

      delete DM.$attributes.password
      return response.ok({
        code: 200,
        message: 'Created successfully!',
        result: DM,
      })
    } catch (e) {
      console.log('register error', e.toString())
      return response.internalServerError({
        code: 500,
        message: e.toString(),
      })
    }
  }

  async update({ request, response }: HttpContext) {
    const DQ = await User.findBy('id', request.param('id'))
    if (!DQ) {
      return response.notFound({
        code: 400,
        message: 'Data not found',
      })
    }

    DQ.email = request.body().email
    DQ.status = request.body().status

    DQ.related('roles').sync(request.body().roles)

    await DQ.save()

    return response.ok({
      code: 200,
      message: 'Update successfully!',
      data: DQ,
    })
  }

  async assignPermission({ request, response }: HttpContext) {
    const DQ = await User.findBy('id', request.param('id'))
    if (!DQ) {
      return response.notFound({
        code: 400,
        message: 'Data not found',
      })
    }

    await DQ.save()

    DQ.related('permissions').sync(request.body().permissions)

    return response.ok({
      code: 200,
      message: 'Assigned successfully!',
      data: DQ,
    })
  }

  async profileUpdate({ request, response }: HttpContext) {
    const DQ = await User.findBy('id', request.param('id'))
    if (!DQ) {
      return response.notFound({
        code: 400,
        message: 'Data not found',
      })
    }
    DQ.related('profile').updateOrCreate(
      {},
      {
        first_name: request.body().first_name,
        last_name: request.body().last_name,
        phone_number: request.body().phone_number,
        address: request.body().address,
        city: request.body().city,
        state: request.body().state,
        country: request.body().country,
        profile_picture: request.body().profile_picture,
      }
    )

    return response.ok({
      code: 200,
      message: 'Update successfully!',
      data: DQ,
    })
  }

  async updateStatus({ request, response }: HttpContext) {
    const DQ = await User.findBy('id', request.param('id'))

    if (!DQ) {
      return response.notFound({
        code: 400,
        message: 'Data not found!',
      })
    }

    DQ.status = request.body().status

    await DQ.save()

    return response.ok({
      code: 200,
      message: 'Update successfully!',
      data: DQ,
    })
  }

  async destroy({ request, response }: HttpContext) {
    const DQ = await User.findBy('id', request.param('id'))
    if (!DQ) {
      return response.notFound({
        code: 400,
        message: 'Data not found',
      })
    }
    await DQ.delete()
    return response.ok({
      code: 200,
      message: 'Record deleted successfully!',
    })
  }
}
