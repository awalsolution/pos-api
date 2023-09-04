import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { BaseController } from 'App/Controllers/BaseController';
import HttpCodes from 'App/Enums/HttpCodes';
import Pagination from 'App/Enums/Pagination';
import Menu from 'App/Models/Menu';

export default class MenuController extends BaseController {
  public MODEL: typeof Menu;
  constructor() {
    super();
    this.MODEL = Menu;
  }
  // find Menu list
  public async find({ request, response }: HttpContextContract) {
    let data = this.MODEL.query();
    // name filter
    if (request.input('name')) {
      data = data.whereILike('menu_name', request.input('name') + '%');
    }

    if (!data) {
      return response.notFound({
        code: HttpCodes.NOT_FOUND,
        message: 'Menus Data is Empty',
      });
    }
    return response.ok({
      code: HttpCodes.SUCCESS,
      result: await data.paginate(
        request.input(Pagination.PAGE_KEY, Pagination.PAGE),
        request.input(Pagination.PER_PAGE_KEY, Pagination.PER_PAGE)
      ),
      message: 'Menus find Successfully',
    });
  }

  public async findParentMenus({ request, response }: HttpContextContract) {
    let data = this.MODEL.query().where('is_parent', true);
    // name filter
    if (request.input('name')) {
      data = data.whereILike('menu_name', request.input('name') + '%');
    }

    if (!data) {
      return response.notFound({
        code: HttpCodes.NOT_FOUND,
        message: 'Menus Data is Empty',
      });
    }
    return response.ok({
      code: HttpCodes.SUCCESS,
      result: await data.paginate(
        request.input(Pagination.PAGE_KEY, Pagination.PAGE),
        request.input(Pagination.PER_PAGE_KEY, Pagination.PER_PAGE)
      ),
      message: 'Menus find Successfully',
    });
  }

  // find Menu using id
  public async get({ request, response }: HttpContextContract) {
    try {
      const data = await this.MODEL.query()
        .where('id', request.param('id'))
        .first();

      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Menu find successfully',
        result: data,
      });
    } catch (e) {
      return response.internalServerError({
        code: HttpCodes.SERVER_ERROR,
        message: e.toString(),
      });
    }
  }
  // create new Menu
  public async create({ request, response }: HttpContextContract) {
    try {
      const MenuExists = await this.MODEL.findBy(
        'menu_name',
        request.body().menu_name
      );

      if (MenuExists) {
        return response.conflict({
          code: HttpCodes.CONFLICTS,
          message: `Menu: "${request.body().menu_name}" already exists!`,
        });
      }
      const menu = new this.MODEL();
      menu.parent_id = request.body().parent_id;
      menu.route_name = request.body().route_name;
      menu.status = request.body().status;
      menu.menu_url = request.body().menu_url;
      menu.menu_name = request.body().menu_name;
      menu.menu_order = request.body().menu_order;
      menu.menu_icon = request.body().menu_icon;
      menu.status = request.body().status;

      const data = await menu.save();
      return response.ok({
        code: HttpCodes.SUCCESS,
        message: `Menu: "${request.body().menu_name}" Created Successfully!`,
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

  // update Menu using id
  public async update({ request, response }: HttpContextContract) {
    try {
      const menu = await this.MODEL.findBy('id', request.param('id'));
      if (!menu) {
        return response.status(HttpCodes.NOT_FOUND).send({
          code: HttpCodes.NOT_FOUND,
          message: 'Menu does not exists!',
        });
      }
      const menuExist = await this.MODEL.query()
        .where('menu_name', 'like', request.body().menu_name)
        .whereNot('id', request.param('id'))
        .first();

      if (menuExist) {
        return response.conflict({
          code: HttpCodes.CONFLICTS,
          message: `Menu: "${request.body().menu_name}" already exists!`,
        });
      }

      menu.parent_id = request.body().parent_id;
      menu.route_name = request.body().route_name;
      menu.status = request.body().status;
      menu.menu_url = request.body().menu_url;
      menu.menu_name = request.body().menu_name;
      menu.menu_order = request.body().menu_order;
      menu.menu_icon = request.body().menu_icon;
      menu.status = request.body().status;

      await menu.save();
      return response.ok({
        code: HttpCodes.SUCCESS,
        message: `Menu: "${request.body().Menu_name}" Update Successfully!`,
        result: Menu,
      });
    } catch (e) {
      console.log(e);
      return response.internalServerError({
        code: HttpCodes.SERVER_ERROR,
        message: e.toString(),
      });
    }
  }

  // delete Menu using id
  public async destroy({ request, response }: HttpContextContract) {
    const data = await this.MODEL.findBy('id', request.param('id'));
    if (!data) {
      return response.notFound({
        code: HttpCodes.NOT_FOUND,
        message: 'Menu not found',
      });
    }
    await data.delete();
    return response.ok({
      code: HttpCodes.SUCCESS,
      result: { message: 'Menu deleted successfully' },
    });
  }
}
