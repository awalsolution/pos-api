import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Hash from '@ioc:Adonis/Core/Hash';
import { BaseController } from 'App/Controllers/BaseController';
import Customer from 'App/Models/Customer';
import HttpCodes from 'App/Enums/HttpCodes';
import ResponseMessages from 'App/Enums/ResponseMessages';

export default class CustomerController extends BaseController {
  public MODEL: typeof Customer;

  constructor() {
    super();
    this.MODEL = Customer;
  }

  /**
   * @login
   * @requestBody {"email": "iqbal@gmail.com","password":"123456"}
   */
  public async login({ auth, request, response }: HttpContextContract) {
    try {
      const email = request.input('email');
      const password = request.input('password');

      let user = await this.MODEL.findBy('email', email);
      if (!user) {
        return response.notFound({
          code: HttpCodes.NOT_FOUND,
          message: 'User Not Found',
        });
      }
      const isPasswordValid = await Hash.verify(user.password, password);
      if (!isPasswordValid) {
        return response.unauthorized({
          code: HttpCodes.UNAUTHORIZED,
          message: 'Invalid Password',
        });
      }
      const DQ = await auth.use('customer').attempt(email, password);
      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Login Successfully!',
        token: DQ.token,
      });
    } catch (e) {
      return response.internalServerError({
        code: HttpCodes.SERVER_ERROR,
        message: e.toString(),
      });
    }
  }

  public async authenticated({ auth, response }) {
    const auth_user = auth.customer;
    if (!auth_user) {
      return response.unauthorized({ message: ResponseMessages.UNAUTHORIZED });
    }
    delete auth_user.$attributes.password;
    return response.ok({
      code: HttpCodes.SUCCESS,
      message: 'Record find successfully',
      data: auth.user,
    });
  }

  /**
   * @findAllRecords
   * @paramUse(paginated)
   */
  public async findAllRecords({ request, response }) {
    // const currentUser = auth.user!;
    let DQ = this.MODEL.query();
    // .whereNotIn('id', [currentUser.id, 1]);

    const page = request.input('page');
    const perPage = request.input('perPage');

    // name filter
    if (request.input('name')) {
      DQ = DQ.whereILike('email', request.input('name') + '%');
    }

    // if (!this.isSuperAdmin(currentUser)) {
    //   if (!this.ischeckAllSuperAdminUser(currentUser)) {
    //     DQ = DQ.where('shop_id', currentUser.shopId!);
    //   }
    // }

    if (!DQ) {
      return response.notFound({
        code: HttpCodes.NOT_FOUND,
        message: 'Data not found',
      });
    }

    if (perPage) {
      return response.ok({
        code: HttpCodes.SUCCESS,
        result: await DQ.preload('customer_profile').paginate(page, perPage),
        message: 'Record find successfully',
      });
    } else {
      return response.ok({
        code: HttpCodes.SUCCESS,
        result: await DQ.preload('customer_profile'),
        message: 'Record find successfully',
      });
    }
  }

  public async findSingleRecord({ request, response }) {
    try {
      const data = await this.MODEL.query()
        .where('id', request.param('id'))
        .preload('customer_profile')
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
   * @requestBody {"first_name":"Iqbal", "last_name":"Hassan", "email":"iqbal@gmail.com", "password":"123456", "user_type":"shop admin", "phone_number":"123456789"}
   */
  public async create({ request, response }) {
    // const currentUser = auth.user!;
    try {
      let DE = await this.MODEL.findBy('email', request.body().email);
      if (DE && !DE.is_email_verified) {
        delete DE.$attributes.password;

        return response.conflict({
          code: HttpCodes.CONFLICTS,
          message: 'Record already exists!',
        });
      }

      const DM = new this.MODEL();
      // if (this.isSuperAdmin(currentUser)) {
      //   DM.shopId = request.body().shop_id;
      // } else {
      //   DM.shopId = currentUser.shopId;
      // }

      DM.email = request.body().email;
      DM.status = request.body().status;
      DM.password = request.body().password;

      await DM.save();
      // DM.related('roles').sync(request.body().roles);
      DM.related('customer_profile').create({
        first_name: request.body().first_name,
        last_name: request.body().last_name,
        phone_number: request.body().phone_number,
      });

      delete DM.$attributes.password;
      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Register Successfully!',
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
   * @requestBody <Customer>
   */
  public async update({ request, response }) {
    // const currentUser = auth.user!;
    const DQ = await this.MODEL.findBy('id', request.param('id'));
    if (!DQ) {
      return response.notFound({
        code: HttpCodes.NOT_FOUND,
        message: 'Data Not Found',
      });
    }

    // if (this.isSuperAdmin(currentUser)) {
    //   DQ.shopId = request.body().shop_id;
    // } else {
    //   DQ.shopId = currentUser.shopId;
    // }

    DQ.email = request.body().email;
    DQ.status = request.body().status;
    DQ.password = request.body().password;

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

  // /**
  //  * @assignPermission
  //  * @requestBody {"permissions":[1,2,3,4]}
  //  */
  // public async assignPermission({ auth, request, response }) {
  //   const currentUser = auth.user!;
  //   const DQ = await this.MODEL.findBy('id', request.param('id'));
  //   if (!DQ) {
  //     return response.notFound({
  //       code: HttpCodes.NOT_FOUND,
  //       message: 'Data Not Found',
  //     });
  //   }

  //   if (this.isSuperAdmin(currentUser)) {
  //     DQ.shopId = request.body().shop_id;
  //   } else {
  //     DQ.shopId = currentUser.shopId;
  //   }

  //   await DQ.save();
  //   DQ.related('permissions').sync(request.body().permissions);

  //   delete DQ.$attributes.password;
  //   return response.ok({
  //     code: HttpCodes.SUCCESS,
  //     message: 'Assigned Permissions successfully.',
  //     result: DQ,
  //   });
  // }

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
    DQ.related('customer_profile').updateOrCreate(
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
      message: 'Update Successfully!',
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
