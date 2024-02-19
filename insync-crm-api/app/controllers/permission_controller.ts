import BaseController from '#controllers/base_controller'
import { HttpContext } from '@adonisjs/core/http'
import HttpCodes from '#enums/http_codes'
import Permission from '#models/permission'

export default class PermissionController extends BaseController {
  declare MODEL: typeof Permission
  constructor() {
    super()
    this.MODEL = Permission
  }

  /**
   * @findAllRecords
   * @paramUse(paginated)
   */
  async findAllRecords({ request, response }: HttpContext) {
    let DQ = this.MODEL.query()

    const page = request.input('page')
    const perPage = request.input('perPage')

    // name filter
    if (request.input('name')) {
      DQ = DQ.whereILike('name', request.input('name') + '%')
    }

    if (perPage) {
      return response.ok({
        code: HttpCodes.SUCCESS,
        result: await DQ.preload('menus').paginate(page, perPage),
        message: 'Permissions Found Successfully',
      })
    } else {
      return response.ok({
        code: HttpCodes.SUCCESS,
        result: await DQ.select('*'),
        message: 'Permissions Found Successfully',
      })
    }
  }

  // find single permission using id
  async findSingleRecord({ request, response }: HttpContext) {
    try {
      const DQ = await this.MODEL.findBy('id', request.param('id'))
      if (!DQ) {
        return response.notFound({
          code: HttpCodes.NOT_FOUND,
          message: 'Permission does not exists!',
        })
      }
      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Permission find Successfully!',
        result: DQ,
      })
    } catch (e) {
      return response.internalServerError({
        code: HttpCodes.SERVER_ERROR,
        message: e.toString(),
      })
    }
  }

  // create new permission
  async create({ request, response }: HttpContext) {
    try {
      const DE = await this.MODEL.findBy('name', request.body().name)
      if (DE) {
        return response.conflict({
          code: HttpCodes.CONFLICTS,
          message: `Permission ${request.input('name')} already exists!`,
        })
      }
      const DM = new this.MODEL()

      DM.menuId = request.body().menu_id
      DM.name = request.body().name
      DM.type = request.body().type

      const DQ = await DM.save()
      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Permission Created Successfully!',
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

  // update existing permission
  async update({ request, response }: HttpContext) {
    try {
      const DQ = await this.MODEL.findBy('id', request.param('id'))
      if (!DQ) {
        return response.notFound({
          code: HttpCodes.NOT_FOUND,
          message: 'Permission does not exists!',
        })
      }
      const permissionExists = await this.MODEL.query()
        .where('name', 'like', request.body().name)
        .whereNot('id', request.param('id'))
        .first()

      if (permissionExists) {
        return response.conflict({
          code: HttpCodes.CONFLICTS,
          message: `${request.body().name} permission already exist!`,
        })
      }

      DQ.menuId = request.body().menu_id
      DQ.name = request.body().name
      DQ.type = request.body().type

      await DQ.save()
      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Permission Updated Successfully!',
        result: DQ,
      })
    } catch (e) {
      return response.internalServerError({
        code: HttpCodes.SERVER_ERROR,
        message: e.message,
      })
    }
  }

  // delete single permission using id
  async destroy({ request, response }: HttpContext) {
    const DQ = await this.MODEL.findBy('id', request.param('id'))
    if (!DQ) {
      return response.notFound({
        code: HttpCodes.NOT_FOUND,
        message: 'Permission not found',
      })
    }
    await DQ.delete()
    return response.ok({
      code: HttpCodes.SUCCESS,
      result: { message: 'Permission deleted successfully' },
    })
  }
}
