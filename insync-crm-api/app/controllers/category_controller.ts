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

  // find categories list
  async findAllRecords({ request, response }: HttpContext) {
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
        message: 'Categories Data is Empty',
      })
    }

    if (perPage) {
      return response.ok({
        code: HttpCodes.SUCCESS,
        result: await DQ.paginate(page, perPage),
        message: 'Categories find Successfully',
      })
    } else {
      return response.ok({
        code: HttpCodes.SUCCESS,
        result: await DQ.select('*'),
        message: 'Categories find Successfully',
      })
    }
  }

  // find category using id
  async findSingleRecord({ request, response }: HttpContext) {
    try {
      const DQ = await this.MODEL.query().where('id', request.param('id')).first()

      if (!DQ) {
        return response.notFound({
          code: HttpCodes.NOT_FOUND,
          message: 'Category Data is Empty',
        })
      }

      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Category find successfully',
        result: DQ,
      })
    } catch (e) {
      return response.internalServerError({
        code: HttpCodes.SERVER_ERROR,
        message: e.toString(),
      })
    }
  }

  // create new Category
  async create({ request, response }: HttpContext) {
    try {
      const DE = await this.MODEL.findBy('name', request.body().name)

      if (DE) {
        return response.conflict({
          code: HttpCodes.CONFLICTS,
          message: `Category: "${request.body().name}" already exists!`,
        })
      }
      const DM = new this.MODEL()

      DM.name = request.body().name
      DM.image = request.body().image

      const DQ = await DM.save()
      return response.ok({
        code: HttpCodes.SUCCESS,
        message: `Category: "${request.body().name}" Created Successfully!`,
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

  // update category using id
  async update({ request, response }: HttpContext) {
    try {
      const DQ = await this.MODEL.findBy('id', request.param('id'))

      if (!DQ) {
        return response.notFound({
          code: HttpCodes.NOT_FOUND,
          message: 'category does not exists!',
        })
      }

      const DE = await this.MODEL.query()
        .where('name', 'like', request.body().name)
        .whereNot('id', request.param('id'))
        .first()

      if (DE) {
        return response.conflict({
          code: HttpCodes.CONFLICTS,
          message: `Category: "${request.body().name}" already exists!`,
        })
      }
      DQ.name = request.body().name
      DQ.image = request.body().image

      await DQ.save()
      return response.ok({
        code: HttpCodes.SUCCESS,
        message: `category: "${request.body().name}" Update Successfully!`,
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

  // delete category using id
  async destroy({ request, response }: HttpContext) {
    const DQ = await this.MODEL.findBy('id', request.param('id'))
    if (!DQ) {
      return response.notFound({
        code: HttpCodes.NOT_FOUND,
        message: 'Category not found',
      })
    }
    await DQ.delete()
    return response.ok({
      code: HttpCodes.SUCCESS,
      result: { message: 'Category deleted successfully!' },
    })
  }
}
