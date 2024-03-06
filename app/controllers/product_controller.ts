import BaseController from '#controllers/base_controller'
import { HttpContext } from '@adonisjs/core/http'
import HttpCodes from '#enums/http_codes'
import Product from '#models/product'
import ProductAttribute from '#models/product_attribute'
import Variant from '#models/variant'

export default class ProductController extends BaseController {
  declare MODEL: typeof Product
  constructor() {
    super()
    this.MODEL = Product
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
      DQ = DQ.whereILike('title', request.input('name') + '%')
    }

    // fetched products with related shops
    if (!this.isSuperAdmin(currentUser)) {
      DQ = DQ.where('shop_id', currentUser.shopId!)
    }

    if (perPage) {
      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Record find successfully!',
        result: await DQ.preload('shop')
          .preload('categories')
          .preload('gallery')
          .preload('variants', (q) => q.preload('gallery'))
          .paginate(page, perPage),
      })
    } else {
      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Record find successfully!',
        result: await DQ.preload('shop'),
      })
    }
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
      DQ = DQ.whereILike('title', request.input('name') + '%')
    }

    if (perPage) {
      response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Record find successfully!',
        result: await DQ.preload('shop')
          .preload('categories')
          .preload('gallery')
          .preload('variants', (q) => q.preload('gallery'))
          .paginate(page, perPage),
      })
    } else {
      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Record find successfully!',
        result: await DQ.preload('shop'),
      })
    }
  }

  async findSingleRecord({ request, response }: HttpContext) {
    try {
      const DQ = await this.MODEL.query()
        .where('id', request.param('product_id'))
        .preload('shop', (qs) => qs.select(['shop_name']))
        .preload('gallery', (q) => q.select(['url']))
        .preload('categories')
        .preload('variants', (q) => q.preload('gallery', (qs) => qs.select(['url'])))
        .first()

      if (!DQ) {
        return response.notFound({
          code: HttpCodes.NOT_FOUND,
          message: 'Data is Empty',
        })
      }

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
   * @requestBody <Product>
   */
  async create({ auth, request, response }: HttpContext) {
    const currentUser = auth.use('api').user!
    try {
      const DE = await this.MODEL.findBy('sku', request.body().sku)
      if (DE) {
        return response.conflict({
          code: HttpCodes.CONFLICTS,
          message: 'Record already exists!',
        })
      }

      const DM = new this.MODEL()
      if (this.isSuperAdmin(currentUser)) {
        DM.shopId = request.body().shop_id
      } else {
        DM.shopId = currentUser.shopId
      }

      DM.name = request.body().name
      DM.sku = request.body().sku
      DM.description = request.body().description
      DM.thumbnail = request.body().thumbnail

      await DM.save()
      if (request.body().gallery) {
        const gallery = request.body().gallery
        for (const item of gallery) {
          await DM.related('gallery').create(item)
        }
      }

      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Created successfully!',
        result: DM,
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
   * @storeAttribute
   * @requestBody <Product>
   */
  async storeAttribute({ request, response }: HttpContext) {
    try {
      const DQ = await this.MODEL.query().where('id', request.param('product_id')).first()

      if (!DQ) {
        return response.notFound({
          code: HttpCodes.NOT_FOUND,
          message: 'Data not found',
        })
      }
      const requestData = request.body().attributes
      console.log(requestData)

      let data = []

      for (const item of requestData) {
        for (const subItem of item.options) {
          try {
            const createdData = await ProductAttribute.create({
              productId: request.param('product_id'),
              name: item.name,
              option: subItem,
            })
            data.push(createdData)
          } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
              return response.conflict({
                code: HttpCodes.CONFLICTS,
                message: 'Record already exists!',
                result: data,
              })
            } else {
              return response.internalServerError({
                code: HttpCodes.SERVER_ERROR,
                message: 'Some thing went worng! try again',
              })
            }
          }
        }
      }

      const combinationData = await this.generateAttributeCombinations(requestData)
      DQ.related('attribute_combination').createMany(combinationData)

      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Created successfully!',
        result: null,
      })
    } catch (e) {
      console.log(e)
      return response.internalServerError({
        code: HttpCodes.SERVER_ERROR,
        message: e.toString(),
      })
    }
  }

  async generateAttributeCombinations(data: any) {
    const cartesian = (a: string[][]) =>
      a.reduce((acc, curr) => acc.flatMap((b) => curr.map((c) => b.concat([c]))), [
        [],
      ] as string[][])

    const combinations = cartesian(data.map((attr: any) => attr.options))

    const result: { [key: string]: string }[] = []

    combinations.forEach((combo) => {
      const comboObj: { [key: string]: string } = {}
      data.forEach((attribute: any, index: any) => {
        comboObj[attribute.name] = combo[index]
      })
      result.push(comboObj)
    })
    console.log(result)
    return result
  }

  async findAttributeByProduct({ request, response }: HttpContext) {
    try {
      const DQ = await this.MODEL.query()
        .where('id', request.param('product_id'))
        .preload('product_attribute')
        .first()

      if (!DQ) {
        return response.notFound({
          code: HttpCodes.NOT_FOUND,
          message: 'Data is Empty',
        })
      }

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
   * @update
   * @requestBody <Product>
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

      DQ.description = request.body().description
      DQ.status = request.body().status
      DQ.thumbnail = request.body().thumbnail

      await DQ.save()

      if (request.body().gallery) {
        const gallery = request.body().gallery
        for (const item of gallery) {
          await DQ.related('gallery').create({ url: item.url })
        }
      }

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
        message: 'Data not found',
      })
    }

    await DQ.delete()
    return response.ok({
      code: HttpCodes.SUCCESS,
      message: 'Record deleted successfully!',
    })
  }

  async destroyAttribute({ request, response }: HttpContext) {
    const DQ = await ProductAttribute.findOrFail(request.param('id'))

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

  async generateVariants({ request, response }: HttpContext) {
    try {
      const product = await this.MODEL.query()
        .where('id', request.param('product_id'))
        .preload('attribute_combination', (q) => q.select(['color', 'size']))
        .first()

      if (!product) {
        return response.notFound({
          code: HttpCodes.NOT_FOUND,
          message: 'Product not found',
        })
      }

      const data = await Promise.all(
        product.attribute_combination.map(async (item) => {
          const res = await Variant.create({
            productId: item.productId,
            color: item.color,
            size: item.size,
          })
          return res
        })
      )

      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Generated successfully!',
        data: data,
      })
    } catch (e) {
      return response.internalServerError({
        code: HttpCodes.SERVER_ERROR,
        message: e.toString(),
      })
    }
  }
}
