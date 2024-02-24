import { BaseController } from 'App/Controllers/BaseController';
import User from 'App/Models/User';
import HttpCodes from 'App/Enums/HttpCodes';

export default class UserController extends BaseController {
  public MODEL: typeof User;

  constructor() {
    super();
    this.MODEL = User;
  }

  /**
   * @findAllRecords
   * @paramUse(paginated)
   */
  public async findAllRecords({ auth, request, response }) {
    const currentUser = auth.user!;
    let DQ = this.MODEL.query().whereNotIn('id', [currentUser.id, 1]);

    const page = request.input('page');
    const perPage = request.input('perPage');

    // name filter
    if (request.input('name')) {
      DQ = DQ.whereILike('email', request.input('name') + '%');
    }

    if (!this.isSuperAdmin(currentUser)) {
      if (!this.ischeckAllSuperAdminUser(currentUser)) {
        DQ = DQ.where('shop_id', currentUser.shopId!);
      }
    }

    if (!DQ) {
      return response.notFound({
        code: HttpCodes.NOT_FOUND,
        message: 'Data not found',
      });
    }

    if (perPage) {
      return response.ok({
        code: HttpCodes.SUCCESS,
        result: await DQ.preload('permissions')
          .preload('roles', (PQ) => {
            PQ.preload('permissions');
          })
          .preload('user_profile')
          .preload('shop')
          .paginate(page, perPage),
        message: 'Record find successfully',
      });
    } else {
      return response.ok({
        code: HttpCodes.SUCCESS,
        result: await DQ.preload('permissions')
          .preload('roles', (PQ) => {
            PQ.preload('permissions');
          })
          .preload('user_profile')
          .preload('shop'),
        message: 'Record find successfully',
      });
    }
  }

  // find single user by id
  public async findSingleRecord({ request, response }) {
    try {
      const data = await this.MODEL.query()
        .where('id', request.param('id'))
        .preload('permissions')
        .preload('roles', (RQ) => {
          RQ.where('name', '!=', 'super admin') // Exclude the "super admin" role
            .preload('permissions');
        })
        .preload('user_profile')
        .preload('shop')
        .first();

      if (data) {
        delete data.$attributes.password;
      }

      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Record find successfully!',
        result: data,
      });
    } catch (e) {
      console.log(e);
      return response.internalServerError({
        code: HttpCodes.SERVER_ERROR,
        message: e.toString(),
      });
    }
  }

  /**
   * @create
   * @requestBody <User>
   */
  public async create({ auth, request, response }) {
    const currentUser = auth.user!;
    try {
      let DE = await this.MODEL.findBy('email', request.body().email);
      if (DE && !DE.isEmailVerified) {
        delete DE.$attributes.password;

        return response.conflict({
          code: HttpCodes.CONFLICTS,
          message: 'Record already exists!',
        });
      }

      const DM = new this.MODEL();
      if (this.isSuperAdmin(currentUser)) {
        DM.shopId = request.body().shop_id;
      } else {
        DM.shopId = currentUser.shopId;
      }
      DM.email = request.body().email;
      DM.status = request.body().status;
      DM.password = request.body().password;

      await DM.save();
      DM.related('roles').sync(request.body().roles);
      DM.related('user_profile').create({
        first_name: request.body().first_name,
        last_name: request.body().last_name,
        phone_number: request.body().phone_number,
      });

      delete DM.$attributes.password;
      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Created Successfully!',
        result: DM,
      });
    } catch (e) {
      console.log('register error', e.toString());
      return response.internalServerError({
        code: HttpCodes.SERVER_ERROR,
        message: e.toString(),
      });
    }
  }

  /**
   * @update
   * @requestBody <User>
   */
  public async update({ auth, request, response }) {
    const currentUser = auth.user!;
    const DQ = await this.MODEL.findBy('id', request.param('id'));
    if (!DQ) {
      return response.notFound({
        code: HttpCodes.NOT_FOUND,
        message: 'Data Not Found',
      });
    }

    if (this.isSuperAdmin(currentUser)) {
      DQ.shopId = request.body().shop_id;
    } else {
      DQ.shopId = currentUser.shopId;
    }

    DQ.email = request.body().email;
    DQ.status = request.body().status;

    await DQ.save();
    // DQ.related('permissions').sync(request.body().permissions);
    // DQ.related('roles').sync(request.body().roles);

    delete DQ.$attributes.password;
    return response.ok({
      code: HttpCodes.SUCCESS,
      message: 'Update Successfully!',
      result: DQ,
    });
  }

  /**
   * @assignPermission
   * @requestBody {"permissions":[1,2,3,4]}
   */
  public async assignPermission({ auth, request, response }) {
    const currentUser = auth.user!;
    const DQ = await this.MODEL.findBy('id', request.param('id'));
    if (!DQ) {
      return response.notFound({
        code: HttpCodes.NOT_FOUND,
        message: 'Data Not Found',
      });
    }

    if (this.isSuperAdmin(currentUser)) {
      DQ.shopId = request.body().shop_id;
    } else {
      DQ.shopId = currentUser.shopId;
    }

    await DQ.save();
    DQ.related('permissions').sync(request.body().permissions);

    delete DQ.$attributes.password;
    return response.ok({
      code: HttpCodes.SUCCESS,
      message: 'Assigned Permissions successfully.',
      result: DQ,
    });
  }

  /**
   * @profileUpdate
   * @requestBody {"first_name":"Iqbal","last_name":"Hassan","phone_number":"123456789","address":"Johar Town","city":"Lahore","state":"Punjab","country":"Pakistan","profile_picture":"/uploads/profile_picture/user-profile.jpg"}
   */
  public async profileUpdate({ request, response }) {
    const DQ = await this.MODEL.findBy('id', request.param('id'));
    if (!DQ) {
      return response.notFound({
        code: HttpCodes.NOT_FOUND,
        message: 'Data not found',
      });
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
    );

    delete DQ.$attributes.password;
    return response.ok({
      code: HttpCodes.SUCCESS,
      message: 'User Profile Update successfully.',
      result: DQ,
    });
  }

  public async destroy({ request, response }) {
    const DQ = await this.MODEL.findBy('id', request.param('id'));
    if (!DQ) {
      return response.notFound({
        code: HttpCodes.NOT_FOUND,
        message: 'Data not found',
      });
    }
    await DQ.delete();
    return response.ok({
      code: HttpCodes.SUCCESS,
      message: 'Record deleted successfully',
    });
  }
}
