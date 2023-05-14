import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { BaseController } from 'App/Controllers/BaseController';
import HttpCodes from 'App/Enums/HttpCodes';
import Pagination from 'App/Enums/Pagination';
import Shop from 'App/Models/Shop';

export default class ShopController extends BaseController {
  public MODEL: typeof Shop;
  constructor() {
    super();
    this.MODEL = Shop;
  }
  // find shop list
  public async find({ request, response }: HttpContextContract) {
    let data = this.MODEL.query();
    if (!data) {
      return response.status(HttpCodes.NOT_FOUND).send({
        code: HttpCodes.NOT_FOUND,
        message: 'Shops Data is Empty',
      });
    }
    return response.status(HttpCodes.SUCCESS).send({
      code: HttpCodes.SUCCESS,
      result: await data.paginate(
        request.input(Pagination.PAGE_KEY, Pagination.PAGE),
        request.input(Pagination.PER_PAGE_KEY, Pagination.PER_PAGE)
      ),
      message: 'Shops find Successfully',
    });
  }
  // find Shop using id
  public async get({ request, response }: HttpContextContract) {
    try {
      const data = await this.MODEL.query().where('id', request.param('id'));

      return response.status(HttpCodes.SUCCESS).send({
        code: HttpCodes.SUCCESS,
        message: 'Shop find successfully',
        result: data,
      });
    } catch (e) {
      return response
        .status(HttpCodes.SERVER_ERROR)
        .send({ code: HttpCodes.SERVER_ERROR, message: e.toString() });
    }
  }
  // create new shop
  public async create({ auth, request, response }: HttpContextContract) {
    try {
      const shopExists = await this.MODEL.findBy('name', request.body().name);
      if (shopExists) {
        return response
          .status(HttpCodes.CONFLICTS)
          .send({ message: 'Shop already exists!' });
      }
      const shop = new this.MODEL();
      shop.userId = auth.user?.id;
      shop.shop_name = request.body().shop_name;
      shop.shop_phone = request.body().shop_phone;
      shop.address = request.body().address;
      shop.city = request.body().city;
      shop.state = request.body().state;
      shop.country = request.body().country;
      shop.shop_logo = request.body().shop_logo;

      const data = await shop.save();
      return response.send({
        code: HttpCodes.SUCCESS,
        message: 'Shop Created Successfully!',
        result: data,
      });
    } catch (e) {
      console.log(e);
      return response
        .status(HttpCodes.SERVER_ERROR)
        .send({ code: HttpCodes.SERVER_ERROR, message: e.toString() });
    }
  }

  // update shop using id
  public async update({ request, response }: HttpContextContract) {
    try {
      const shop = await this.MODEL.findBy('id', request.param('id'));
      if (!shop) {
        return response.status(HttpCodes.NOT_FOUND).send({
          code: HttpCodes.NOT_FOUND,
          message: 'Shop does not exists!',
        });
      }
      const shopTypeExist = await this.MODEL.query()
        .where('name', 'like', request.body().name)
        .whereNot('id', request.param('id'))
        .first();
      if (shopTypeExist) {
        return response.status(HttpCodes.CONFLICTS).send({
          code: HttpCodes.CONFLICTS,
          message: `${request.body().name} Shop type already exist!`,
        });
      }
      shop.shop_name = request.body().shop_name;
      shop.shop_name = request.body().shop_phone;
      shop.status = request.body().status;
      shop.address = request.body().address;
      shop.city = request.body().city;
      shop.state = request.body().state;
      shop.country = request.body().country;
      shop.shop_logo = request.body().shop_logo;

      await shop.save();
      return response.send({
        code: 200,
        message: 'Shop updated Successfully!',
        result: shop,
      });
    } catch (e) {
      console.log(e);
      return response
        .status(HttpCodes.SERVER_ERROR)
        .send({ code: HttpCodes.SERVER_ERROR, message: e.message });
    }
  }
  //update shop status
  public async updateShopStatus({ request, response }: HttpContextContract) {
    const data = await this.MODEL.findBy('id', request.param('id'));
    if (!data) {
      return response.status(HttpCodes.NOT_FOUND).send({
        code: HttpCodes.NOT_FOUND,
        message: 'Shop not found',
      });
    }
    data.status = request.body().status;
    await data.save();
    return response.status(HttpCodes.SUCCESS).send({
      code: HttpCodes.SUCCESS,
      result: { message: 'Shop Status Update successfully' },
    });
  }

  // delete shop using id
  public async destroy({ request, response }: HttpContextContract) {
    const data = await this.MODEL.findBy('id', request.param('id'));
    if (!data) {
      return response.status(HttpCodes.NOT_FOUND).send({
        code: HttpCodes.NOT_FOUND,
        message: 'Shop not found',
      });
    }
    await data.delete();
    return response.status(HttpCodes.SUCCESS).send({
      code: HttpCodes.SUCCESS,
      result: { message: 'Shop deleted successfully' },
    });
  }
}
