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
      return response.notFound({
        code: HttpCodes.NOT_FOUND,
        message: 'Shops Data is Empty',
      });
    }
    return response.ok({
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
      const data = await this.MODEL.query()
        .where('id', request.param('id'))
        .first();

      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Shop find successfully',
        result: data,
      });
    } catch (e) {
      return response.internalServerError({
        code: HttpCodes.SERVER_ERROR,
        message: e.toString(),
      });
    }
  }
  // create new shop
  public async create({ request, response }: HttpContextContract) {
    try {
      const shopExists = await this.MODEL.findBy(
        'shop_name',
        request.body().shop_name
      );

      if (shopExists) {
        return response.conflict({
          code: HttpCodes.CONFLICTS,
          message: `Shop: "${request.body().shop_name}" already exists!`,
        });
      }
      const shop = new this.MODEL();
      shop.shop_name = request.body().shop_name;
      shop.shop_phone = request.body().shop_phone;
      shop.address = request.body().address;
      shop.city = request.body().city;
      shop.state = request.body().state;
      shop.country = request.body().country;
      shop.shop_logo = request.body().shop_logo;

      const data = await shop.save();
      return response.ok({
        code: HttpCodes.SUCCESS,
        message: `Shop: "${request.body().shop_name}" Created Successfully!`,
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
      const shopExist = await this.MODEL.query()
        .where('shop_name', 'like', request.body().shop_name)
        .whereNot('id', request.param('id'))
        .first();

      if (shopExist) {
        return response.conflict({
          code: HttpCodes.CONFLICTS,
          message: `Shop: "${request.body().shop_name}" already exists!`,
        });
      }
      shop.shop_name = request.body().shop_name;
      shop.shop_phone = request.body().shop_phone;
      shop.status = request.body().status;
      shop.address = request.body().address;
      shop.city = request.body().city;
      shop.state = request.body().state;
      shop.country = request.body().country;
      shop.shop_logo = request.body().shop_logo;

      await shop.save();
      return response.ok({
        code: HttpCodes.SUCCESS,
        message: `Shop: "${request.body().shop_name}" Update Successfully!`,
        result: shop,
      });
    } catch (e) {
      console.log(e);
      return response.internalServerError({
        code: HttpCodes.SERVER_ERROR,
        message: e.toString(),
      });
    }
  }
  //update shop status
  public async updateShopStatus({ request, response }: HttpContextContract) {
    const data = await this.MODEL.findBy('id', request.param('id'));
    if (!data) {
      return response.notFound({
        code: HttpCodes.NOT_FOUND,
        message: 'Shop not found',
      });
    }
    data.status = request.body().status;
    await data.save();
    return response.ok({
      code: HttpCodes.SUCCESS,
      result: { message: 'Shop Status Update successfully' },
    });
  }

  // delete shop using id
  public async destroy({ request, response }: HttpContextContract) {
    const data = await this.MODEL.findBy('id', request.param('id'));
    if (!data) {
      return response.notFound({
        code: HttpCodes.NOT_FOUND,
        message: 'Shop not found',
      });
    }
    await data.delete();
    return response.ok({
      code: HttpCodes.SUCCESS,
      result: { message: 'Shop deleted successfully' },
    });
  }
}
