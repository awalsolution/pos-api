import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Logger from "@ioc:Adonis/Core/Logger";
import Role from "App/Models/Acl/Role";
import User from "App/Models/User";
import ProfileValidator from "App/Validators/ProfileValidator";
import RegistorValidator from "App/Validators/RegistorValidator";
// import UserProfile from "App/Models/UserProfile";
import UserServices from "App/services/UserServices";

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

  public async create({ request, response }: HttpContextContract) {
    const { email, password } = await request.validate(RegistorValidator);
    const { first_name, last_name } = await request.validate(ProfileValidator);

    // find role
    let finnd_role: any;
    try {
      finnd_role = await Role.findByOrFail("name", "user");
    } catch (error) {
      Logger.error("Role not found at AuthController.register:\n%o", error);
      return response.abort({ message: "Account could not be created" });
    }
    // Create a new user
    const user = await User.create({
      email,
      password: password,
    });
    if (user) {
      // await user.related("roles").attach(finnd_role?.id);
      user.related("roles").sync([finnd_role?.id]);
      await user.related("userProfile").create({
        first_name,
        last_name,
      });
      const userService = new UserServices({ email });
      const fetchUser = await userService.getUserModel();
      return response.ok({
        message: "Account was created successfully.",
        result: fetchUser,
      });
    } else {
      Logger.error("User could not be created at AuthController.register");
      return response.abort({ message: "Account could not be created" });
    }
    // let newUser: any;
    // let newProfile: any;
    // let newRole: any;
    // if (ctx.params.userId) {
    //   newUser = await User.find(ctx.params.userId);
    // } else {
    //   const check_user_email = await User.findBy(
    //     "email",
    //     ctx.request.body().email
    //   );
    //   if (check_user_email) {
    //     return ctx.response.conflict({ message: "User Already Exist" });
    //   }
    //   newUser = new User();
    //   newProfile = new UserProfile();
    //   newRole = new Role();
    //   console.log("newRole", newRole);
    // }

    // newProfile.first_name = profile_payload?.first_name;
    // newProfile.last_name = profile_payload?.last_name;
    // newUser.email = regUser.email;
    // newUser.password = regUser.password;

    // // find role
    // let finnd_role: any;
    // try {
    //   debugger;
    //   finnd_role = await Role.findBy("name", "user");
    //   console.log("try find role", finnd_role);
    // } catch (error) {
    //   Logger.error("Role not found at UserController.register:\n%o", error);
    //   return ctx.response.abort({ message: "Account could not be created" });
    // }
    // console.log(finnd_role);
    // if (newUser) {
    //   await newUser.save();
    //   await newUser.related("rolesRelation").save(finnd_role?.id);
    //   await newUser.related("userProfile").save(newProfile);
    // }
    // console.log(newUser);
    // const userService = new UserServices({ email: regUser.email });
    // const fetchUser = await userService.getUserModel();

    // return ctx.response.ok({
    //   result: fetchUser,
    //   message: "Operation Successfully",
    // });
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
