import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { BaseController } from "App/Controllers/BaseController";
import Role from "App/Models/Acl/Role";
import HttpCodes from "App/Enums/HttpCodes";
import Pagination from "App/Enums/Pagination";

export default class RolesController extends BaseController {
  public MODEL: typeof Role;

  constructor() {
    super();
    this.MODEL = Role;
  }

  public async create({ request, response }: HttpContextContract) {
    try {
      const roleExist = await this.MODEL.findBy("name", request.body().name);
      if (roleExist) {
        return response
          .status(HttpCodes.CONFLICTS)
          .send({ message: "Role already exists!" });
      }
      const role = new this.MODEL();
      role.name = request.input("name");
      role.description = request.input("description");
      const data = await role.save();
      return response.send({ status: true, message: "Role saved!", data });
    } catch (e) {
      console.log(e);
      return response
        .status(HttpCodes.SERVER_ERROR)
        .send({ status: false, message: e.toString() });
    }
  }

  public async find({ request, response }: HttpContextContract) {
    let baseQuery = this.MODEL.query();
    // if (request.user.isSuperAdmin) {
    //   baseQuery = baseQuery
    // } else if (request.user.isAdmin) {
    //   let roles = ['super admin', 'admin']
    //   baseQuery = baseQuery.orWhereNotIn('name', roles)
    // }
    if (request.input("name")) {
      baseQuery.where("name", "like", `${request.input("name")}%`);
    }
    return response.send(
      await baseQuery.paginate(
        request.input(Pagination.PAGE_KEY, Pagination.PAGE),
        request.input(Pagination.PER_PAGE_KEY, Pagination.PER_PAGE)
      )
    );
  }

  public async update({ request, response }: HttpContextContract) {
    try {
      const role = await this.MODEL.findBy("id", request.param("id"));
      if (!role) {
        return response
          .status(HttpCodes.NOT_FOUND)
          .send({ status: false, message: "Role does not exists!" });
      }
      const roleTypeExist = await this.MODEL.query()
        .where("name", "like", request.body().name)
        .whereNot("id", request.param("id"))
        .first();
      if (roleTypeExist) {
        return response.status(HttpCodes.CONFLICTS).send({
          status: false,
          message: `${request.body().name} Role type already exist!`,
        });
      }
      role.name = request.body().name;
      role.description = request.body().description;
      await role.save();
      return response.send({
        status: true,
        message: "Role updated!",
        date: role,
      });
    } catch (e) {
      console.log(e);
      return response
        .status(HttpCodes.SERVER_ERROR)
        .send({ status: false, message: e.message });
    }
  }

  // public async index({ response }: HttpContextContract) {
  //   const roles = await Role.all();
  //   return response.ok({ result: roles, message: "Roles Find Successfully" });
  // }

  // public async create(ctx: HttpContextContract) {
  //   let newRole: any;
  //   if (ctx.params.roleId) {
  //     newRole = await Role.find(ctx.params.roleId);
  //   } else {
  //     const check_role = await Role.findBy("name", ctx.request.body().name);
  //     if (check_role) {
  //       return ctx.response.conflict({ message: "Role Already Exist" });
  //     }
  //     newRole = new Role();
  //   }

  //   const roleSchema = schema.create({
  //     name: schema.string([rules.required()]),
  //     description: schema.string.optional(),
  //   });

  //   const payload: any = await ctx.request.validate({ schema: roleSchema });

  //   newRole.name = payload.name;
  //   newRole.description = payload.description;

  //   await newRole.save();

  //   return ctx.response.ok({
  //     result: newRole,
  //     message: "Operation Successfully",
  //   });
  // }
  // public async show({ params, response }: HttpContextContract) {
  //   const role = await Role.find(params.roleId);

  //   if (!role) {
  //     return response.notFound({ message: "Role not found" });
  //   }
  //   return response.ok({ result: role, message: "Role Find Successfully" });
  // }

  // public async delete({ params, response }: HttpContextContract) {
  //   const role = await Role.find(params.roleId);

  //   if (!role) {
  //     return response.notFound({ message: "Role not found" });
  //   }

  //   await role.delete();

  //   return response.ok({ message: "Role deleted successfully." });
  // }
}
