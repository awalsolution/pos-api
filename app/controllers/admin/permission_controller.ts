import { HttpContext } from '@adonisjs/core/http'
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

      if (perPage) {
        return response.ok({
          code: 200,
          data: await DQ.paginate(page, perPage),
          message: 'Record find successfully!',
        })
      } else {
        return response.ok({
          code: 200,
          data: await DQ.select('*'),
          message: 'Record find successfully!',
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
      return response.internalServerError({
        code: 500,
        message: e.toString(),
      })
    }
  }

  async create({ request, response }: HttpContext) {
    try {
      const DE = await Permission.findBy('name', request.body().name)
      if (DE) {
        return response.conflict({
          code: 409,
          message: 'Data already exists!',
        })
      }
      const DM = new Permission()

      DM.name = request.body().name

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

  async update({ request, response }: HttpContext) {
    try {
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
          message: 'Data already exist!',
        })
      }

      DQ.name = request.body().name

      await DQ.save()
      return response.ok({
        code: 200,
        message: 'Updated successfully!',
        data: DQ,
      })
    } catch (e) {
      return response.internalServerError({
        code: 500,
        message: e.message,
      })
    }
  }

  async destroy({ request, response }: HttpContext) {
    const DQ = await Permission.findBy('id', request.param('id'))
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
