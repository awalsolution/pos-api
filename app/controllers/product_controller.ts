import BaseController from '#controllers/base_controller'
import { HttpContext } from '@adonisjs/core/http'
import HttpCodes from '#enums/http_codes'
import Product from '#models/product'
import Attribute from '#models/attribute'
// import Variant from '#models/variant'

export default class ProductController extends BaseController {
  declare MODEL: typeof Product
  constructor() {
    super()
    this.MODEL = Product
  }

  /**
   * @index
   * @paramUse(paginated)
   */
  async index({ auth, request, response }: HttpContext) {
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
          .preload('category')
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

  async show({ request, response }: HttpContext) {
    try {
      const DQ = await this.MODEL.query()
        .where('id', request.param('product_id'))
        .preload('shop')
        .preload('gallery')
        .preload('category')
        .preload('attributes')
        .preload('variants', (q) => q.preload('gallery'))
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
      if (this.ischeckAllSuperAdminUser(currentUser)) {
        DM.shopId = request.body().shop_id
      } else {
        DM.shopId = currentUser.shopId
      }

      DM.name = request.body().name
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

  // /**
  //  * @storeAttribute
  //  * @requestBody <Product>
  //  */
  // async storeAttribute({ request, response }: HttpContext) {
  //   try {
  //     const DQ = await this.MODEL.query().where('id', request.param('product_id')).first()

  //     if (!DQ) {
  //       return response.notFound({
  //         code: HttpCodes.NOT_FOUND,
  //         message: 'Data not found',
  //       })
  //     }
  //     const requestData = request.body().attributes
  //     console.log(requestData)

  //     let data = []

  //     for (const item of requestData) {
  //       console.log(item.key)
  //       for (const subItem of item.values) {
  //         try {
  //           const createdData = await ProductAttribute.create({
  //             productId: request.param('product_id'),
  //             option_1: item.key === 'option1' ? item.name : null,
  //             option_2: item.key === 'option2' ? item.name : null,
  //             option_3: item.key === 'option3' ? item.name : null,
  //             value: subItem,
  //           })
  //           data.push(createdData)
  //         } catch (error) {
  //           console.log(error)
  //           // if (error.code === 'ER_DUP_ENTRY') {
  //           //   return response.conflict({
  //           //     code: HttpCodes.CONFLICTS,
  //           //     message: 'Record already exists!',
  //           //     result: data,
  //           //   })
  //           // } else {
  //           //   return response.internalServerError({
  //           //     code: HttpCodes.SERVER_ERROR,
  //           //     message: 'Some thing went worng! try again',
  //           //   })
  //           // }
  //         }
  //       }
  //     }

  //     // const combinationData = await this.generateAttributeCombinations(requestData)
  //     // DQ.related('attribute_combination').createMany(combinationData)

  //     return response.ok({
  //       code: HttpCodes.SUCCESS,
  //       message: 'Created successfully!',
  //       result: null,
  //     })
  //   } catch (e) {
  //     console.log(e)
  //     return response.internalServerError({
  //       code: HttpCodes.SERVER_ERROR,
  //       message: e.toString(),
  //     })
  //   }
  // }

  // async generateAttributeCombinations(data: any) {
  //   const cartesian = (a: string[][]) =>
  //     a.reduce((acc, curr) => acc.flatMap((b) => curr.map((c) => b.concat([c]))), [
  //       [],
  //     ] as string[][])

  //   const combinations = cartesian(data.map((attr: any) => attr.options))

  //   const result: { [key: string]: string }[] = []

  //   combinations.forEach((combo) => {
  //     const comboObj: { [key: string]: string } = {}
  //     data.forEach((attribute: any, index: any) => {
  //       comboObj[attribute.name] = combo[index]
  //     })
  //     result.push(comboObj)
  //   })
  //   console.log(result)
  //   return result
  // }

  // async findAttributeByProduct({ request, response }: HttpContext) {
  //   try {
  //     const DQ = await this.MODEL.query()
  //       .where('id', request.param('product_id'))
  //       .preload('product_attribute')
  //       .first()

  //     if (!DQ) {
  //       return response.notFound({
  //         code: HttpCodes.NOT_FOUND,
  //         message: 'Data is Empty',
  //       })
  //     }

  //     return response.ok({
  //       code: HttpCodes.SUCCESS,
  //       message: 'Record find successfully!',
  //       result: DQ,
  //     })
  //   } catch (e) {
  //     return response.internalServerError({
  //       code: HttpCodes.SERVER_ERROR,
  //       message: e.toString(),
  //     })
  //   }
  // }

  /**
   * @update
   * @requestBody <Product>
   */
  async update({ auth, request, response }: HttpContext) {
    const currentUser = auth.use('api').user!
    try {
      const DQ = await this.MODEL.findBy('id', request.param('product_id'))

      if (!DQ) {
        return response.notFound({
          code: HttpCodes.NOT_FOUND,
          message: 'Data does not exists!',
        })
      }
      let SHOPID: number | null = null
      if (this.ischeckAllSuperAdminUser(currentUser)) {
        SHOPID = request.body().shop_id
      } else {
        SHOPID = currentUser.shopId
      }

      DQ.name = request.body().name
      DQ.description = request.body().description
      DQ.status = request.body().status
      DQ.categoryId = request.body().category_id
      DQ.thumbnail = request.body().thumbnail

      await DQ.save()

      //attributes
      if (request.body().attributes) {
        for (const attribute of request.body().attributes) {
          const res = await DQ.related('attributes').create({
            shopId: SHOPID,
            name: attribute.name,
          })
          if (attribute.values) {
            for (const item of attribute.values) {
              const att = await Attribute.findOrFail(res.id)
              await att.related('values').create({ value: item })
            }
          }
        }
      }

      // varaints
      // if (request.body().variants) {
      //   for (const item of request.body().variants) {
      //     await DQ.related('variants').create({})
      //   }
      // }

      // gallery images
      if (request.body().gallery) {
        for (const image of request.body().gallery) {
          if (image.id) {
            const existImg = await DQ.related('gallery').query().where('id', image.id).first()

            if (existImg) {
              // update image
              existImg.merge(image)
            }
          } else {
            // Create new image
            await DQ.related('gallery').create(image)
          }
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

  // async destroyAttribute({ request, response }: HttpContext) {
  //   const DQ = await ProductAttribute.findOrFail(request.param('id'))

  //   if (!DQ) {
  //     return response.notFound({
  //       code: HttpCodes.NOT_FOUND,
  //       message: 'Data not found',
  //     })
  //   }

  //   await DQ.delete()

  //   return response.ok({
  //     code: HttpCodes.SUCCESS,
  //     message: 'Record deleted successfully!',
  //   })
  // }

  // async generateVariants({ request, response }: HttpContext) {
  //   try {
  //     const product = await this.MODEL.query()
  //       .where('id', request.param('product_id'))
  //       .preload('attribute_combination', (q) => q.select(['color', 'size']))
  //       .first()

  //     if (!product) {
  //       return response.notFound({
  //         code: HttpCodes.NOT_FOUND,
  //         message: 'Product not found',
  //       })
  //     }

  //     const data = await Promise.all(
  //       product.attribute_combination.map(async (item) => {
  //         const res = await Variant.create({
  //           productId: item.productId,
  //           color: item.color,
  //           size: item.size,
  //         })
  //         return res
  //       })
  //     )

  //     return response.ok({
  //       code: HttpCodes.SUCCESS,
  //       message: 'Generated successfully!',
  //       data: data,
  //     })
  //   } catch (e) {
  //     return response.internalServerError({
  //       code: HttpCodes.SERVER_ERROR,
  //       message: e.toString(),
  //     })
  //   }
  // }
}

// const modifiedData = requestData.map((item: any) => {
//   console.log(item)
//   let newObj: any = {}
//   newObj[item.key] = item.name
//   newObj.values = item.values
//   return newObj
// })

// console.log(modifiedData)
