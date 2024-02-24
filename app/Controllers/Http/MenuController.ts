import { BaseController } from 'App/Controllers/BaseController';
import HttpCodes from 'App/Enums/HttpCodes';
import Menu from 'App/Models/Menu';

export default class MenuController extends BaseController {
  public MODEL: typeof Menu;
  constructor() {
    super();
    this.MODEL = Menu;
  }

  /**
   * @findAllRecords
   * @paramUse(paginated)
   */
  public async findAllRecords({ auth, request, response }) {
    const currentUser = auth.user;
    let DQ = this.MODEL.query();

    const page = request.input('page');
    const perPage = request.input('perPage');

    // name filter
    if (request.input('name')) {
      DQ = DQ.whereILike('menu_name', request.input('name') + '%');
    }

    if (!DQ) {
      return response.notFound({
        code: HttpCodes.NOT_FOUND,
        message: 'Data is Empty',
      });
    }

    if (perPage) {
      response.ok({
        code: HttpCodes.SUCCESS,
        result: await DQ.preload('permissions').paginate(page, perPage),
        message: 'Record find Successfully',
      });
    } else {
      if (!this.ischeckAllSuperAdminUser(currentUser)) {
        response.ok({
          code: HttpCodes.SUCCESS,
          result: await DQ.where('menu_type', 'public').preload(
            'permissions',
            (q) => {
              q.where('type', 'public');
            }
          ),
          message: 'Record find Successfully',
        });
      } else {
        response.ok({
          code: HttpCodes.SUCCESS,
          result: await DQ.preload('permissions'),
          message: 'Record find Successfully',
        });
      }
    }
  }

  public async findSingleRecord({ request, response }) {
    try {
      const DQ = await this.MODEL.query()
        .where('id', request.param('id'))
        .first();

      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Record find successfully',
        result: DQ,
      });
    } catch (e) {
      return response.internalServerError({
        code: HttpCodes.SERVER_ERROR,
        message: e.toString(),
      });
    }
  }

  /**
   * @create
   * @requestBody {"menu_name":"Dashboard","menu_type":"public"}
   */
  public async create({ request, response }) {
    try {
      const DE = await this.MODEL.findBy('menu_name', request.body().menu_name);

      if (DE) {
        return response.conflict({
          code: HttpCodes.CONFLICTS,
          message: 'Record already exists!',
        });
      }
      const DM = new this.MODEL();

      DM.menu_name = request.body().menu_name;
      DM.menu_type = request.body().menu_type;

      const DQ = await DM.save();
      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Created Successfully!',
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

  /**
   * @update
   * @requestBody {"menu_name":"Dashboard","menu_type":"public"}
   */
  public async update({ request, response }) {
    try {
      const DQ = await this.MODEL.findBy('id', request.param('id'));
      if (!DQ) {
        return response.notFound({
          code: HttpCodes.NOT_FOUND,
          message: 'Data does not exists!',
        });
      }
      const DE = await this.MODEL.query()
        .where('menu_name', 'like', request.body().menu_name)
        .whereNot('id', request.param('id'))
        .first();

      if (DE) {
        return response.conflict({
          code: HttpCodes.CONFLICTS,
          message: 'Record already exists!',
        });
      }

      DQ.menu_name = request.body().menu_name;
      DQ.menu_type = request.body().menu_type;

      await DQ.save();
      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Update Successfully!',
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

  public async destroy({ request, response }) {
    const DQ = await this.MODEL.findBy('id', request.param('id'));
    if (!DQ) {
      return response.notFound({
        code: HttpCodes.NOT_FOUND,
        message: 'Record not found',
      });
    }
    await DQ.delete();
    return response.ok({
      code: HttpCodes.SUCCESS,
      message: 'Record deleted successfully',
    });
  }
}
