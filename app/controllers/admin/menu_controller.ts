import { HttpContext } from '@adonisjs/core/http'
import Menu from '#models/menu'

export default class MenuController {
  async index({ request, response }: HttpContext) {
    let DQ = Menu.query()

    const page = request.input('page')
    const perPage = request.input('perPage')

    // name filter
    if (request.input('name')) {
      DQ = DQ.whereILike('menu_name', request.input('name') + '%')
    }

    if (!DQ) {
      return response.notFound({
        code: 400,
        message: 'Data is Empty',
      })
    }

    if (perPage) {
      response.ok({
        code: 200,
        data: await DQ.preload('permissions').paginate(page, perPage),
        message: 'Record find Successfully',
      })
    } else {
      response.ok({
        code: 200,
        data: await DQ.preload('permissions'),
        message: 'Record find successfully!',
      })
    }
  }

  async show({ request, response }: HttpContext) {
    try {
      const DQ = await Menu.query().where('id', request.param('id')).first()

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
      const DE = await Menu.findBy('menu_name', request.body().menu_name)

      if (DE) {
        return response.conflict({
          code: 409,
          message: 'Record already exists!',
        })
      }
      const DM = new Menu()

      DM.menu_name = request.body().menu_name
      DM.menu_type = request.body().menu_type

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
      const DQ = await Menu.findBy('id', request.param('id'))
      if (!DQ) {
        return response.notFound({
          code: 400,
          message: 'Data does not exists!',
        })
      }
      const DE = await Menu.query()
        .where('menu_name', 'like', request.body().menu_name)
        .whereNot('id', request.param('id'))
        .first()

      if (DE) {
        return response.conflict({
          code: 409,
          message: 'Record already exists!',
        })
      }

      DQ.menu_name = request.body().menu_name
      DQ.menu_type = request.body().menu_type

      await DQ.save()
      return response.ok({
        code: 200,
        message: 'Update successfully!',
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

  async destroy({ request, response }: HttpContext) {
    const DQ = await Menu.findBy('id', request.param('id'))
    if (!DQ) {
      return response.notFound({
        code: 400,
        message: 'Record not found',
      })
    }
    await DQ.delete()
    return response.ok({
      code: 200,
      message: 'Record deleted successfully!',
    })
  }
}
