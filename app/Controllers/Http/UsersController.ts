import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { schema, rules } from "@ioc:Adonis/Core/Validator";
import User from "App/Models/User";

export default class UsersController {
  public async index({ response }: HttpContextContract) {
    // const users = await User.all();
    const users = await User.query()
      .preload("roles", (roleQuery) => roleQuery.select("name", "id"))
      .preload("userProfile", (profileQuery) => {
        profileQuery.select(
          "first_name",
          "last_name",
          "profile_picture",
          "phone_number",
          "address",
          "city",
          "zipcode",
          "state",
          "country",
          "created_at",
          "updated_at"
        );
      });

    return response.ok({ result: users, message: "Users Find Successfully" });
  }

  public async create(ctx: HttpContextContract) {
    let newUser: any;
    if (ctx.params.userId) {
      newUser = await User.find(ctx.params.userId);
    } else {
      const check_user_email = await User.findBy(
        "email",
        ctx.request.body().email
      );
      const check_user_phone = await User.findBy(
        "phone_number",
        ctx.request.body().phone
      );
      if (check_user_email || check_user_phone) {
        return ctx.response.conflict({ message: "User Already Exist" });
      }
      newUser = new User();
    }

    const userSchema = schema.create({
      first_name: schema.string.optional(),
      last_name: schema.string.optional(),
      email: schema.string([rules.required()]),
      password: schema.string([rules.required()]),
      phone_number: schema.string.optional(),
      company: schema.string.optional(),
      address: schema.string.optional(),
      email_verified_at: schema.string.optional(),
      remember_me_token: schema.boolean.optional(),
    });

    const payload: any = await ctx.request.validate({ schema: userSchema });

    newUser.first_name = payload.first_name;
    newUser.last_name = payload.last_name;
    newUser.email = payload.email;
    newUser.password = payload.password;
    newUser.phone_number = payload.phone_number;
    newUser.address = payload.address;
    newUser.email_verified_at = payload.email_verified_at;
    newUser.remember_me_token = payload.remember_me_token;

    await newUser.save();

    return ctx.response.ok({
      result: newUser,
      message: "Operation Successfully",
    });
  }
  public async show({ params, response }: HttpContextContract) {
    const user = await User.find(params.userId);

    if (!user) {
      return response.notFound({ message: "User not found" });
    }
    return response.ok({ result: user, message: "User Find Successfully" });
  }

  public async delete({ params, response }: HttpContextContract) {
    const user = await User.find(params.userId);

    if (!user) {
      return response.notFound({ message: "User not found" });
    }

    await user.delete();

    return response.ok({ message: "User deleted successfully." });
  }
}
