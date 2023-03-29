import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { BaseController } from "App/Controllers/BaseController";
import HttpCodes from "App/Enums/HttpCodes";
import Permission from "App/Models/Acl/Permission";

export default class PermissionsController extends BaseController {
  public MODEL: typeof Permission;
  constructor() {
    super();
    this.MODEL = Permission;
  }
  public async create({ request, response }: HttpContextContract) {
    try {
      const permissionExists = await this.MODEL.findBy(
        "name",
        request.body().name
      );
      if (permissionExists) {
        return response.conflict({ message: "Permission already exists!" });
      }
      const permission = new this.MODEL();
      permission.name = request.input("name");
      const data = await permission.save();
      return response.send({
        status: true,
        message: "Permission saved!",
        data,
      });
    } catch (e) {
      console.log(e);
      return response
        .status(HttpCodes.SERVER_ERROR)
        .send({ status: false, message: e.toString() });
    }
  }

  public async update({ request, response }: HttpContextContract) {
    try {
      const permission = await this.MODEL.findBy("id", request.param("id"));
      if (!permission) {
        return response
          .status(HttpCodes.NOT_FOUND)
          .send({ status: false, message: "Permission does not exists!" });
      }
      const permissionExists = await this.MODEL.query()
        .where("name", "like", request.body().name)
        .whereNot("id", request.param("id"))
        .first();
      if (permissionExists) {
        return response.status(HttpCodes.CONFLICTS).send({
          status: false,
          message: `${request.body().name} permission already exist!`,
        });
      }
      permission.name = request.body().name;
      await permission.save();
      return response.send({
        status: true,
        message: "Permission updated!",
        date: permission,
      });
    } catch (e) {
      return response
        .status(HttpCodes.SERVER_ERROR)
        .send({ status: false, message: e.message });
    }
  }

  // public async index({ response }: HttpContextContract) {
  //   const permissions = await Permission.all();
  //   return response.ok({
  //     result: permissions,
  //     message: "Permissions Find Successfully",
  //   });
  // }
  // public async create(ctx: HttpContextContract) {
  //   let newPermission: any;
  //   if (ctx.params.permissionId) {
  //     newPermission = await Permission.find(ctx.params.permissionId);
  //   } else {
  //     const check_permission = await Permission.findBy(
  //       "name",
  //       ctx.request.body().name
  //     );
  //     if (check_permission) {
  //       return ctx.response.conflict({ message: "Permission Already Exist" });
  //     }
  //     newPermission = new Permission();
  //   }
  //   const permissionSchema = schema.create({
  //     name: schema.string([rules.required()]),
  //     description: schema.string.optional(),
  //   });
  //   const payload: any = await ctx.request.validate({
  //     schema: permissionSchema,
  //   });
  //   newPermission.name = payload.name;
  //   newPermission.description = payload.description;
  //   await newPermission.save();
  //   return ctx.response.ok({
  //     result: newPermission,
  //     message: "Operation Successfully",
  //   });
  // }
  // public async show({ params, response }: HttpContextContract) {
  //   const permission = await Permission.find(params.permissionId);
  //   if (!permission) {
  //     return response.notFound({ message: "Permission not found" });
  //   }
  //   return response.ok({
  //     result: permission,
  //     message: "Permission Find Successfully",
  //   });
  // }
  // public async delete({ params, response }: HttpContextContract) {
  //   const permission = await Permission.find(params.permissionId);
  //   if (!permission) {
  //     return response.notFound({ message: "Permission not found" });
  //   }
  //   await permission.delete();
  //   return response.ok({ message: "Permission deleted successfully." });
  // }
}
