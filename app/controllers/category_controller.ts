import BaseController from '#controllers/base_controller'
import { HttpContext } from '@adonisjs/core/http'
import HttpCodes from '#enums/http_codes'
import Category from '#models/category'

export default class CategoryController extends BaseController {
  declare MODEL: typeof Category
  constructor() {
    super()
    this.MODEL = Category
  }

  /**
   * @findAllRecordsForFrontend
   * @paramUse(paginated)
   */
  async findAllRecordsForFrontend({ request, response }: HttpContext) {
    let DQ = this.MODEL.query()

    const page = request.input('page')
    const perPage = request.input('perPage')

    // name filter
    if (request.input('name')) {
      DQ = DQ.whereILike('name', request.input('name') + '%')
    }

    if (!DQ) {
      return response.notFound({
        code: HttpCodes.NOT_FOUND,
        message: 'Data is Empty',
      })
    }

    if (perPage) {
      return response.ok({
        code: HttpCodes.SUCCESS,
        result: await DQ.preload('shop').preload('sub_category').paginate(page, perPage),
        message: 'Record find successfully',
      })
    } else {
      return response.ok({
        code: HttpCodes.SUCCESS,
        result: await DQ.select('*'),
        message: 'Record find successfully',
      })
    }
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
      DQ = DQ.whereILike('name', request.input('name') + '%')
    }

    if (!this.isSuperAdmin(currentUser)) {
      if (!this.ischeckAllSuperAdminUser(currentUser)) {
        DQ = DQ.where('shop_id', currentUser?.shopId!)
      }
    }

    if (!DQ) {
      return response.notFound({
        code: HttpCodes.NOT_FOUND,
        message: 'Data is Empty',
      })
    }

    if (perPage) {
      return response.ok({
        code: HttpCodes.SUCCESS,
        result: await DQ.preload('shop').preload('sub_category').paginate(page, perPage),
        message: 'Record find successfully',
      })
    } else {
      return response.ok({
        code: HttpCodes.SUCCESS,
        result: await DQ.select('*'),
        message: 'Record find successfully',
      })
    }
  }

  async findSingleRecord({ request, response }: HttpContext) {
    try {
      const DQ = await this.MODEL.query().where('id', request.param('id')).first()

      if (!DQ) {
        return response.notFound({
          code: HttpCodes.NOT_FOUND,
          message: 'Data is Empty',
        })
      }

      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Record find successfully',
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
   * @requestBody <Category>
   */
  async create({ auth, request, response }: HttpContext) {
    const currentUser = auth.use('api').user!
    try {
      const DE = await this.MODEL.query()
        .where({
          name: request.body().name,
          shop_id: currentUser.shopId!,
        })
        .first()

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
        DM.shopId = currentUser.shopId!
      }
      DM.name = request.body().name
      DM.status = request.body().status
      DM.image = request.body().image

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
   * @requestBody <Category>
   */
  async update({ request, response }: HttpContext) {
    try {
      const DQ = await this.MODEL.findBy('id', request.param('id'))

      if (!DQ) {
        return response.notFound({
          code: HttpCodes.NOT_FOUND,
          message: 'Record not exists!',
        })
      }

      const DE = await this.MODEL.query()
        .where('name', 'like', request.body().name)
        .whereNot('id', request.param('id'))
        .first()

      if (DE) {
        return response.conflict({
          code: HttpCodes.CONFLICTS,
          message: 'Record already exists!',
        })
      }
      DQ.name = request.body().name
      DQ.image = request.body().image
      DQ.status = request.body().status

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

  /**
   * @updateStatus
   * @requestBody {"status":0}
   */
  async updateStatus({ request, response }: HttpContext) {
    const DQ = await this.MODEL.findBy('id', request.param('id'))

    if (!DQ) {
      return response.notFound({
        code: HttpCodes.NOT_FOUND,
        message: 'Data not found!',
      })
    }

    DQ.status = request.body().status

    await DQ.save()

    delete DQ.$attributes.password
    return response.ok({
      code: HttpCodes.SUCCESS,
      message: 'Update successfully!',
      result: DQ,
    })
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
