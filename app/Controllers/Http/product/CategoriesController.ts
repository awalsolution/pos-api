import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { BaseController } from 'App/Controllers/BaseController';
import HttpCodes from 'App/Enums/HttpCodes';
import Pagination from 'App/Enums/Pagination';
import Categories from 'App/Models/product/Categories';

export default class CategoriesController extends BaseController {
  public MODEL: typeof Categories;
  constructor() {
    super();
    this.MODEL = Categories;
  }
  // find categories list
  public async find({ request, response }: HttpContextContract) {
    let data = this.MODEL.query();
    if (!data) {
      return response.notFound({
        code: HttpCodes.NOT_FOUND,
        message: 'Categories Data is Empty',
      });
    }
    return response.ok({
      code: HttpCodes.SUCCESS,
      result: await data.paginate(
        request.input(Pagination.PAGE_KEY, Pagination.PAGE),
        request.input(Pagination.PER_PAGE_KEY, Pagination.PER_PAGE)
      ),
      message: 'Categories find Successfully',
    });
  }
  // find category using id
  public async get({ request, response }: HttpContextContract) {
    try {
      const data = await this.MODEL.query()
        .where('id', request.param('id'))
        .first();

      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Category find successfully',
        result: data,
      });
    } catch (e) {
      return response.internalServerError({
        code: HttpCodes.SERVER_ERROR,
        message: e.toString(),
      });
    }
  }
  // create new Category
  public async create({ request, response }: HttpContextContract) {
    try {
      const exist = await this.MODEL.findBy('name', request.body().name);

      if (exist) {
        return response.conflict({
          code: HttpCodes.CONFLICTS,
          message: `Category: "${request.body().name}" already exists!`,
        });
      }
      const category = new this.MODEL();
      category.name = request.body().name;
      category.image = request.body().image;

      const data = await category.save();
      return response.ok({
        code: HttpCodes.SUCCESS,
        message: `Category: "${request.body().name}" Created Successfully!`,
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

  // update category using id
  public async update({ request, response }: HttpContextContract) {
    try {
      const category = await this.MODEL.findBy('id', request.param('id'));
      if (!category) {
        return response.status(HttpCodes.NOT_FOUND).send({
          code: HttpCodes.NOT_FOUND,
          message: 'category does not exists!',
        });
      }
      const exist = await this.MODEL.query()
        .where('name', 'like', request.body().name)
        .whereNot('id', request.param('id'))
        .first();

      if (exist) {
        return response.conflict({
          code: HttpCodes.CONFLICTS,
          message: `Category: "${request.body().name}" already exists!`,
        });
      }
      category.name = request.body().name;
      category.image = request.body().image;

      await category.save();
      return response.ok({
        code: HttpCodes.SUCCESS,
        message: `category: "${request.body().name}" Update Successfully!`,
        result: category,
      });
    } catch (e) {
      console.log(e);
      return response.internalServerError({
        code: HttpCodes.SERVER_ERROR,
        message: e.toString(),
      });
    }
  }

  // delete category using id
  public async destroy({ request, response }: HttpContextContract) {
    const data = await this.MODEL.findBy('id', request.param('id'));
    if (!data) {
      return response.notFound({
        code: HttpCodes.NOT_FOUND,
        message: 'Category not found',
      });
    }
    await data.delete();
    return response.ok({
      code: HttpCodes.SUCCESS,
      result: { message: 'Category deleted successfully!' },
    });
  }
}
