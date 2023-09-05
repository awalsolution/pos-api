import { BaseController } from 'App/Controllers/BaseController';
import HttpCodes from 'App/Enums/HttpCodes';
import Menu from 'App/Models/Menu';

export default class MenuController extends BaseController {
  public MODEL: typeof Menu;
  constructor() {
    super();
    this.MODEL = Menu;
  }

  // find Menu list
  public async findAllRecords({ request, response }) {
    let DQ = this.MODEL.query();

    const page = request.input('page');
    const pageSize = request.input('pageSize');

    // name filter
    if (request.input('name')) {
      DQ = DQ.whereILike('menu_name', request.input('name') + '%');
    }

    if (!DQ) {
      return response.notFound({
        code: HttpCodes.NOT_FOUND,
        message: 'Menus Data is Empty',
      });
    }

    if (pageSize) {
      response.ok({
        code: HttpCodes.SUCCESS,
        result: await DQ.preload('permissions').paginate(page, pageSize),
        message: 'Menus find Successfully',
      });
    } else {
      response.ok({
        code: HttpCodes.SUCCESS,
        result: await DQ.preload('permissions'),
        message: 'Menus find Successfully',
      });
    }
  }

  // find Menu using id
  public async findSingleRecord({ request, response }) {
    try {
      const DQ = await this.MODEL.query()
        .where('id', request.param('id'))
        .first();

      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Menu find successfully',
        result: DQ,
      });
    } catch (e) {
      return response.internalServerError({
        code: HttpCodes.SERVER_ERROR,
        message: e.toString(),
      });
    }
  }

  // create new Menu
  public async create({ request, response }) {
    try {
      const DE = await this.MODEL.findBy('menu_name', request.body().menu_name);

      if (DE) {
        return response.conflict({
          code: HttpCodes.CONFLICTS,
          message: `Menu: "${request.body().menu_name}" already exists!`,
        });
      }
      const DM = new this.MODEL();

      DM.menu_name = request.body().menu_name;

      const DQ = await DM.save();
      return response.ok({
        code: HttpCodes.SUCCESS,
        message: `Menu: "${request.body().menu_name}" Created Successfully!`,
        result: DQ,
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
  public async update({ request, response }) {
    try {
      const DQ = await this.MODEL.findBy('id', request.param('id'));
      if (!DQ) {
        return response.notFound({
          code: HttpCodes.NOT_FOUND,
          message: 'Menu does not exists!',
        });
      }
      const DE = await this.MODEL.query()
        .where('menu_name', 'like', request.body().menu_name)
        .whereNot('id', request.param('id'))
        .first();

      if (DE) {
        return response.conflict({
          code: HttpCodes.CONFLICTS,
          message: `Menu: "${request.body().menu_name}" already exists!`,
        });
      }

      DQ.menu_name = request.body().menu_name;

      await DQ.save();
      return response.ok({
        code: HttpCodes.SUCCESS,
        message: `Menu: "${request.body().Menu_name}" Update Successfully!`,
        result: DQ,
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
  public async destroy({ request, response }) {
    const DQ = await this.MODEL.findBy('id', request.param('id'));
    if (!DQ) {
      return response.notFound({
        code: HttpCodes.NOT_FOUND,
        message: 'Menu not found',
      });
    }
    await DQ.delete();
    return response.ok({
      code: HttpCodes.SUCCESS,
      result: { message: 'Menu deleted successfully' },
    });
  }
}
