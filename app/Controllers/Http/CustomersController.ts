import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { BaseController } from 'App/Controllers/BaseController';
import Customer from 'App/Models/customer/Customer';
import HttpCodes from 'App/Enums/HttpCodes';
import Pagination from 'App/Enums/Pagination';
// import { imageUpload } from "App/Helpers/MainHelpers";

export default class CustomersController extends BaseController {
  public MODEL: typeof Customer;

  constructor() {
    super();
    this.MODEL = Customer;
  }
  // create new customer
  public async create({ auth, request, response }: HttpContextContract) {
    try {
      let exists = await this.MODEL.findBy('email', request.body().email);
      if (exists && !exists.isEmailVerified) {
        delete exists.$attributes.password;

        return response.conflict({
          code: HttpCodes.CONFLICTS,
          message: `Provided Email: ' ${request.body().email} ' Already exists`,
        });
      }

      const customer = new this.MODEL();
      customer.shopId = auth.user?.shopId;
      customer.email = request.body().email;
      customer.phoneNumber = request.body().phone_number;
      customer.firstName = request.body().first_name;
      customer.lastName = request.body().last_name;
      customer.password = request.body().password;

      await customer.save();
      await customer
        .related('billing_address')
        .create(request.body().billing_address);
      await customer
        .related('shipping_address')
        .create(request.body().shipping_address);

      delete customer.$attributes.password;

      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'User Register Successfully!',
        result: customer,
      });
    } catch (e) {
      console.log('register error', e.toString());
      return response.internalServerError({
        code: HttpCodes.SERVER_ERROR,
        message: e.toString(),
      });
    }
  }

  // find all customers  list
  public async find({ request, response }: HttpContextContract) {
    let data = this.MODEL.query();

    return response.status(HttpCodes.SUCCESS).send({
      code: HttpCodes.SUCCESS,
      result: await data
        .preload('billing_address')
        .preload('shipping_address')
        .preload('shop')
        .paginate(
          request.input(Pagination.PAGE_KEY, Pagination.PAGE),
          request.input(Pagination.PER_PAGE_KEY, Pagination.PER_PAGE)
        ),
      message: 'Users find Successfully',
    });
  }

  // find single user by id
  public async get({ request, response }: HttpContextContract) {
    try {
      const data = await this.MODEL.query()
        .where('id', request.param('id'))
        .preload('billing_address')
        .preload('shipping_address')
        .first();

      if (data) {
        delete data.$attributes.password;
      }
      return response.status(HttpCodes.SUCCESS).send({
        code: HttpCodes.SUCCESS,
        message: 'User find Successfully!',
        result: data,
      });
    } catch (e) {
      return response
        .status(HttpCodes.SERVER_ERROR)
        .send({ code: HttpCodes.SERVER_ERROR, message: e.toString() });
    }
  }

  // update user
  public async update({ request, response }: HttpContextContract) {
    const customer = await this.MODEL.findBy('id', request.param('id'));
    if (!customer) {
      return response.notFound({
        code: HttpCodes.NOT_FOUND,
        message: 'User Not Found',
      });
    }
    customer.phoneNumber = request.body().phone_number;
    customer.firstName = request.body().first_name;
    customer.lastName = request.body().last_name;
    customer.profilePicture = request.body().profilePicture;

    await customer
      .related('billing_address')
      .updateOrCreate({}, request.body().billing_address);
    await customer
      .related('shipping_address')
      .updateOrCreate({}, request.body().shipping_address);
    delete customer.$attributes.password;

    return response.ok({
      code: HttpCodes.SUCCESS,
      message: 'Profile Update successfully.',
      result: customer,
    });
  }

  //update user status
  public async updateCustomerStatus({
    request,
    response,
  }: HttpContextContract) {
    const data = await this.MODEL.findBy('id', request.param('id'));
    if (!data) {
      return response.notFound({
        code: HttpCodes.NOT_FOUND,
        message: 'Customer not found',
      });
    }
    data.status = request.body().status;
    await data.save();
    return response.ok({
      code: HttpCodes.SUCCESS,
      message: 'Status Update successfully',
      result: data,
    });
  }

  // delete single user using id
  public async destroy({ request, response }: HttpContextContract) {
    const data = await this.MODEL.findBy('id', request.param('id'));
    if (!data) {
      return response.status(HttpCodes.NOT_FOUND).send({
        status: false,
        message: 'Customer not found',
      });
    }
    await data.delete();
    return response.status(HttpCodes.SUCCESS).send({
      code: HttpCodes.SUCCESS,
      result: { message: 'Customer deleted successfully' },
    });
  }
}
