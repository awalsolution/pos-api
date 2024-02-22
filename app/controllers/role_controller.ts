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
    const currentUser = auth.user!
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
        message: 'Roles Found Successfully',
      })
    } else {
      return response.ok({
        code: HttpCodes.SUCCESS,
        result: await DQ.preload('permissions'),
        message: 'Roles Found Successfully',
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
          message: 'Role does not exists!',
        })
      }

      return response.send({
        code: HttpCodes.SUCCESS,
        message: 'Role find Successfully!',
        result: DQ,
      })
    } catch (e) {
      return response.internalServerError({
        code: HttpCodes.SERVER_ERROR,
        message: e.toString(),
      })
    }
  }

  // create new Role
  async create({ auth, request, response }: HttpContext) {
    const currentUser = auth.use('api').user!
    try {
      const DE = await this.MODEL.findBy('name', request.body().name)

      if (DE) {
        return response.conflict({
          code: HttpCodes.CONFLICTS,
          message: `Role ${request.input('name')} already exists!`,
        })
      }

      const DM = new this.MODEL()

      if (await this.isSuperAdmin(currentUser)) {
        DM.shopId = request.body().shop_id
      } else {
        DM.shopId = currentUser.shopId
      }

      DM.name = request.input('name')

      const DQ = await DM.save()
      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Role Created Successfully!',
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

  // update Role using id
  async update({ auth, request, response }: HttpContext) {
    const currentUser = auth.use('api').user!
    try {
      const DQ = await this.MODEL.findBy('id', request.param('id'))
      if (!DQ) {
        return response.notFound({
          code: HttpCodes.NOT_FOUND,
          message: 'Role does not exists!',
        })
      }
      const DE = await this.MODEL.query()
        .where('name', 'like', request.body().name)
        .whereNot('id', request.param('id'))
        .first()

      if (DE) {
        return response.conflict({
          code: HttpCodes.CONFLICTS,
          message: `${request.body().name} Role type already exist!`,
        })
      }

      if (await this.isSuperAdmin(currentUser)) {
        DQ.shopId = request.body().shop_id
      } else {
        DQ.shopId = currentUser.shopId
      }

      DQ.name = request.body().name

      await DQ.save()
      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Role updated Successfully!',
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

  // assign permission to role
  async assignPermission({ request, response }: HttpContext) {
    try {
      const DQ = await this.MODEL.findBy('id', request.param('id'))
      if (!DQ) {
        return response.notFound({
          code: HttpCodes.NOT_FOUND,
          message: 'Role does not exists!',
        })
      }

      await DQ.related('permissions').sync(request.body().permissions)
      await DQ.save()
      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Operation Successfully!',
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
        message: 'Role not found',
      })
    }
    await DQ.delete()
    return response.ok({
      code: HttpCodes.SUCCESS,
      message: 'Record deleted successfully',
    })
  }
}
