import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { schema, rules } from "@ioc:Adonis/Core/Validator";
import Role from "App/Models/Role";

export default class RolesController {
  public async index({ response }: HttpContextContract) {
    const roles = await Role.all();
    return response.ok({ data: roles, message: "Roles Find Successfully" });
  }

  public async create(ctx: HttpContextContract) {
    let newRole: any;
    if (ctx.params.roleId) {
      newRole = await Role.find(ctx.params.roleId);
    } else {
      const check_role = await Role.findBy("name", ctx.request.body().name);
      if (check_role) {
        return ctx.response.conflict({ message: "Role Already Exist" });
      }
      newRole = new Role();
    }

    const roleSchema = schema.create({
      name: schema.string([rules.required()]),
      description: schema.string.optional(),
    });

    const payload: any = await ctx.request.validate({ schema: roleSchema });

    newRole.name = payload.name;
    newRole.description = payload.description;

    await newRole.save();

    return ctx.response.ok({
      data: newRole,
      message: "Operation Successfully",
    });
  }
  public async show({ params, response }: HttpContextContract) {
    const role = await Role.find(params.roleId);

    if (!role) {
      return response.notFound({ message: "Role not found" });
    }
    return response.ok({ data: role, message: "Role Find Successfully" });
  }

  public async delete({ params, response }: HttpContextContract) {
    const role = await Role.find(params.roleId);

    if (!role) {
      return response.notFound({ message: "Role not found" });
    }

    await role.delete();

    return response.ok({ message: "Role deleted successfully." });
  }
}
