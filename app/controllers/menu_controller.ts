import BaseController from '#controllers/base_controller'
import { HttpContext } from '@adonisjs/core/http'
import HttpCodes from '#enums/http_codes'
import Menu from '#models/menu'

export default class MenuController extends BaseController {
  declare MODEL: typeof Menu
  constructor() {
    super()
    this.MODEL = Menu
  }

  /**
   * @findAllRecords
   * @paramUse(paginated)
   */
  async findAllRecords({ auth, request, response }: HttpContext) {
    const currentUser = auth.use('api').user!
    let DQ = this.MODEL.query()

    const page = request.input('page')
    const perPage = request.input('perPage')

    // name filter
    if (request.input('name')) {
      DQ = DQ.whereILike('menu_name', request.input('name') + '%')
    }

    if (!DQ) {
      return response.notFound({
        code: HttpCodes.NOT_FOUND,
        message: 'Data is Empty',
      })
    }

    if (perPage) {
      response.ok({
        code: HttpCodes.SUCCESS,
        result: await DQ.preload('permissions').paginate(page, perPage),
        message: 'Record find Successfully',
      })
    } else {
      if (!this.ischeckAllSuperAdminUser(currentUser)) {
        response.ok({
          code: HttpCodes.SUCCESS,
          result: await DQ.where('menu_type', '').preload('permissions', (q) => {
            q.where('type', '')
          }),
          message: 'Record find Successfully',
        })
      } else {
        response.ok({
          code: HttpCodes.SUCCESS,
          result: await DQ.preload('permissions'),
          message: 'Record find successfully!',
        })
      }
    }
  }

  async findSingleRecord({ request, response }: HttpContext) {
    try {
      const DQ = await this.MODEL.query().where('id', request.param('id')).first()

      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Record find successfully!',
        result: DQ,
      })
    } catch (e) {
      return response.internalServerError({
        code: HttpCodes.SERVER_ERROR,
        message: e.toString(),
      })
    }
  }

  /**
   * @create
   * @requestBody {"menu_name":"Dashboard","menu_type":"public"}
   */
  async create({ request, response }: HttpContext) {
    try {
      const DE = await this.MODEL.findBy('menu_name', request.body().menu_name)

      if (DE) {
        return response.conflict({
          code: HttpCodes.CONFLICTS,
          message: 'Record already exists!',
        })
      }
      const DM = new this.MODEL()

      DM.menu_name = request.body().menu_name
      DM.menu_type = request.body().menu_type

      const DQ = await DM.save()
      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Created successfully!',
        result: DQ,
      })
    } catch (e) {
      console.log(e)
      return response.internalServerError({
        code: HttpCodes.SERVER_ERROR,
        message: e.toString(),
      })
    }
  }

  /**
   * @update
   * @requestBody {"menu_name":"Dashboard","menu_type":"public"}
   */
  async update({ request, response }: HttpContext) {
    try {
      const DQ = await this.MODEL.findBy('id', request.param('id'))
      if (!DQ) {
        return response.notFound({
          code: HttpCodes.NOT_FOUND,
          message: 'Data does not exists!',
        })
      }
      const DE = await this.MODEL.query()
        .where('menu_name', 'like', request.body().menu_name)
        .whereNot('id', request.param('id'))
        .first()

      if (DE) {
        return response.conflict({
          code: HttpCodes.CONFLICTS,
          message: 'Record already exists!',
        })
      }

      DQ.menu_name = request.body().menu_name
      DQ.menu_type = request.body().menu_type

      await DQ.save()
      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Update successfully!',
        result: DQ,
      })
    } catch (e) {
      console.log(e)
      return response.internalServerError({
        code: HttpCodes.SERVER_ERROR,
        message: e.toString(),
      })
    }
  }

  async destroy({ request, response }: HttpContext) {
    const DQ = await this.MODEL.findBy('id', request.param('id'))
    if (!DQ) {
      return response.notFound({
        code: HttpCodes.NOT_FOUND,
        message: 'Record not found',
      })
    }
    await DQ.delete()
    return response.ok({
      code: HttpCodes.SUCCESS,
      message: 'Record deleted successfully!',
    })
  }
}
