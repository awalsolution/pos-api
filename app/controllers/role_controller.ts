import BaseController from '#controllers/base_controller'
import { HttpContext } from '@adonisjs/core/http'
import HttpCodes from '#enums/http_codes'
import Role from '#models/role'

export default class RoleController extends BaseController {
  declare MODEL: typeof Role

  constructor() {
    super()
    this.MODEL = Role
  }

  /**
   * @findAllRecords
   * @paramUse(paginated)
   */
  async findAllRecords({ auth, request, response }: HttpContext) {
    const currentUser = auth.use('api').user!
    let DQ = this.MODEL.query().whereNot('name', 'super admin')

    const page = request.input('page')
    const perPage = request.input('perPage')

    if (request.input('name')) {
      DQ = DQ.whereILike('name', request.input('name') + '%')
    }

    if (!this.isSuperAdmin(currentUser)) {
      DQ = DQ.where('shop_id', currentUser.shopId!)
    }

    if (perPage) {
      return response.ok({
        code: HttpCodes.SUCCESS,
        result: await DQ.preload('shop').paginate(page, perPage),
        message: 'Record find successfully!',
      })
    } else {
      return response.ok({
        code: HttpCodes.SUCCESS,
        result: await DQ.preload('permissions'),
        message: 'Record find successfully!',
      })
    }
  }

  // find Role using id
  async findSingleRecord({ request, response }: HttpContext) {
    try {
      const DQ = await this.MODEL.query()
        .where('id', request.param('id'))
        .preload('permissions')
        .first()

      if (!DQ) {
        return response.notFound({
          code: HttpCodes.NOT_FOUND,
          message: 'Data does not exists!',
        })
      }

      return response.send({
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
   * @requestBody <Role>
   */
  async create({ auth, request, response }: HttpContext) {
    const currentUser = auth.use('api').user!
    try {
      const DE = await this.MODEL.findBy('name', request.body().name)

      if (DE) {
        return response.conflict({
          code: HttpCodes.CONFLICTS,
          message: 'Data already exists!',
        })
      }

      const DM = new this.MODEL()

      if (this.isSuperAdmin(currentUser)) {
        DM.shopId = request.body().shop_id
      } else {
        DM.shopId = currentUser.shopId
      }

      DM.name = request.input('name')

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
   * @requestBody <Role>
   */
  async update({ auth, request, response }: HttpContext) {
    const currentUser = auth.use('api').user!
    try {
      const DQ = await this.MODEL.findBy('id', request.param('id'))
      if (!DQ) {
        return response.notFound({
          code: HttpCodes.NOT_FOUND,
          message: 'Data does not exists!',
        })
      }
      const DE = await this.MODEL.query()
        .where('name', 'like', request.body().name)
        .whereNot('id', request.param('id'))
        .first()

      if (DE) {
        return response.conflict({
          code: HttpCodes.CONFLICTS,
          message: 'Record already exist!',
        })
      }

      if (this.isSuperAdmin(currentUser)) {
        DQ.shopId = request.body().shop_id
      } else {
        DQ.shopId = currentUser.shopId
      }

      DQ.name = request.body().name

      await DQ.save()
      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Updated successfully!',
        result: DQ,
      })
    } catch (e) {
      console.log(e)
      return response.internalServerError({
        code: HttpCodes.SERVER_ERROR,
        message: e.message,
      })
    }
  }

  /**
   * @assignPermission
   * @requestBody {"permissions":[1,2,3,4]}
   */
  async assignPermission({ request, response }: HttpContext) {
    try {
      const DQ = await this.MODEL.findBy('id', request.param('id'))
      if (!DQ) {
        return response.notFound({
          code: HttpCodes.NOT_FOUND,
          message: 'Data does not exists!',
        })
      }

      await DQ.related('permissions').sync(request.body().permissions)
      await DQ.save()
      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Record successfully!',
        result: DQ,
      })
    } catch (e) {
      console.log(e)
      return response.internalServerError({
        code: HttpCodes.SERVER_ERROR,
        message: e.message,
      })
    }
  }

  // delete Role using id
  async destroy({ request, response }: HttpContext) {
    const DQ = await this.MODEL.findBy('id', request.param('id'))
    if (!DQ) {
      return response.notFound({
        code: HttpCodes.NOT_FOUND,
        message: 'Data not found',
      })
    }
    await DQ.delete()
    return response.ok({
      code: HttpCodes.SUCCESS,
      message: 'Record deleted successfully!',
    })
  }
}
