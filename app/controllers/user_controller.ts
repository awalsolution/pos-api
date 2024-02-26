import BaseController from '#controllers/base_controller'
import { HttpContext } from '@adonisjs/core/http'
import HttpCodes from '#enums/http_codes'
import User from '#models/user'

export default class UserController extends BaseController {
  declare MODEL: typeof User

  constructor() {
    super()
    this.MODEL = User
  }

  /**
   * @findAllRecords
   * @paramUse(paginated)
   */
  async findAllRecords({ auth, request, response }: HttpContext) {
    const currentUser = auth.use('api').user!
    let DQ = this.MODEL.query().whereNotIn('id', [currentUser.id, 1])

    const page = request.input('page')
    const perPage = request.input('perPage')

    // name filter
    if (request.input('name')) {
      DQ = DQ.whereILike('email', request.input('name') + '%')
    }

    if (!this.isSuperAdmin(currentUser)) {
      if (!this.ischeckAllSuperAdminUser(currentUser)) {
        DQ = DQ.where('shop_id', currentUser.shopId!)
      }
    }

    if (!DQ) {
      return response.notFound({
        code: HttpCodes.NOT_FOUND,
        message: 'Data not found',
      })
    }

    if (perPage) {
      return response.ok({
        code: HttpCodes.SUCCESS,
        result: await DQ.preload('permissions')
          .preload('roles', (PQ) => {
            PQ.preload('permissions')
          })
          .preload('user_profile')
          .preload('shop')
          .paginate(page, perPage),
        message: 'Record find successfully!',
      })
    } else {
      return response.ok({
        code: HttpCodes.SUCCESS,
        result: await DQ.preload('permissions')
          .preload('roles', (PQ) => {
            PQ.preload('permissions')
          })
          .preload('user_profile')
          .preload('shop'),
        message: 'Record find successfully!',
      })
    }
  }

  // find single user by id
  async findSingleRecord({ request, response }: HttpContext) {
    try {
      const data = await this.MODEL.query()
        .where('id', request.param('id'))
        .preload('permissions')
        .preload('roles', (RQ) => {
          RQ.where('name', '!=', 'super admin') // Exclude the "super admin" role
            .preload('permissions')
        })
        .preload('user_profile')
        .preload('shop')
        .first()

      if (data) {
        delete data.$attributes.password
      }

      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Record find successfully!',
        result: data,
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
   * @create
   * @requestBody <User>
   */
  async create({ auth, request, response }: HttpContext) {
    const currentUser = auth.use('api').user!
    try {
      let DE = await this.MODEL.findBy('email', request.body().email)
      if (DE && !DE.is_email_verified) {
        delete DE.$attributes.password

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
      DM.email = request.body().email
      DM.status = request.body().status
      DM.password = request.body().password
      DM.user_type = request.body().user_type

      await DM.save()
      DM.related('roles').sync(request.body().roles)
      DM.related('user_profile').create({
        first_name: request.body().first_name,
        last_name: request.body().last_name,
        phone_number: request.body().phone_number,
      })

      delete DM.$attributes.password
      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Created successfully!',
        result: DM,
      })
    } catch (e) {
      console.log('register error', e.toString())
      return response.internalServerError({
        code: HttpCodes.SERVER_ERROR,
        message: e.toString(),
      })
    }
  }

  /**
   * @update
   * @requestBody <User>
   */
  async update({ auth, request, response }: HttpContext) {
    const currentUser = auth.use('api').user!
    const DQ = await this.MODEL.findBy('id', request.param('id'))
    if (!DQ) {
      return response.notFound({
        code: HttpCodes.NOT_FOUND,
        message: 'Data not found',
      })
    }

    if (this.isSuperAdmin(currentUser)) {
      DQ.shopId = request.body().shop_id
    } else {
      DQ.shopId = currentUser.shopId
    }

    DQ.email = request.body().email

    await DQ.save()

    delete DQ.$attributes.password
    return response.ok({
      code: HttpCodes.SUCCESS,
      message: 'Update successfully!',
      result: DQ,
    })
  }

  /**
   * @assignPermission
   * @requestBody {"permissions":[1,2,3,4]}
   */
  async assignPermission({ auth, request, response }: HttpContext) {
    const currentUser = auth.use('api').user!
    const DQ = await this.MODEL.findBy('id', request.param('id'))
    if (!DQ) {
      return response.notFound({
        code: HttpCodes.NOT_FOUND,
        message: 'Data not found',
      })
    }

    if (this.isSuperAdmin(currentUser)) {
      DQ.shopId = request.body().shop_id
    } else {
      DQ.shopId = currentUser.shopId
    }

    await DQ.save()
    DQ.related('permissions').sync(request.body().permissions)

    delete DQ.$attributes.password
    return response.ok({
      code: HttpCodes.SUCCESS,
      message: 'Assigned successfully!',
      result: DQ,
    })
  }

  /**
   * @profileUpdate
   * @requestBody {"first_name":"Iqbal","last_name":"Hassan","phone_number":"123456789","address":"Johar Town","city":"Lahore","state":"Punjab","country":"Pakistan","profile_picture":"/uploads/profile_picture/user-profile.jpg"}
   */
  async profileUpdate({ request, response }: HttpContext) {
    const DQ = await this.MODEL.findBy('id', request.param('id'))
    if (!DQ) {
      return response.notFound({
        code: HttpCodes.NOT_FOUND,
        message: 'Data not found',
      })
    }
    DQ.related('user_profile').updateOrCreate(
      {},
      {
        first_name: request.body().first_name,
        last_name: request.body().last_name,
        phone_number: request.body().phone_number,
        address: request.body().address,
        city: request.body().city,
        state: request.body().state,
        country: request.body().country,
        profile_picture: request.body().profile_picture,
      }
    )

    delete DQ.$attributes.password
    return response.ok({
      code: HttpCodes.SUCCESS,
      message: 'Update successfully!',
      result: DQ,
    })
  }

  /**
   * @updateStatus
   * @requestBody {"status":"false"}
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
}
