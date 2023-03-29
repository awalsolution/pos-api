import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";
import { BaseController } from "App/Controllers/BaseController";
import { RegistorValidator } from "App/Validators/user/RegistorValidator";
import Role from "App/Models/Acl/Role";
import User from "App/Models/User";
import UserHasRole from "App/Models/Acl/UserHasRole";
import HttpCodes from "App/Enums/HttpCodes";
import ResponseMessages from "App/Enums/ResponseMessages";
import UpdateUserValidator from "App/Validators/user/UpdateUserValidator";
import Pagination from "App/Enums/Pagination";
import { s3Link } from "App/Helpers/MainHelpers";
// import UserProfile from "App/Models/UserProfile";

export default class UsersController extends BaseController {
  public MODEL: typeof User;

  constructor() {
    super();
    this.MODEL = User;
  }

  public async create({ request, response }: HttpContextContract) {
    const payload = await request.validate(RegistorValidator);
    const results = await this.MODEL.create(payload);
    delete results.$attributes.password;
    return response.send(results);
  }

  public async get({ request, response }: HttpContextContract) {
    try {
      const data = await this.MODEL.findBy("id", request.param("id"));
      if (data) {
        delete data.$attributes.password;
      }
      return response.send({ status: true, data: data || {} });
    } catch (e) {
      return response
        .status(HttpCodes.SERVER_ERROR)
        .send({ status: false, message: e.toString() });
    }
  }

  public async update({ auth, request, response }: HttpContextContract) {
    const payload = await request.validate(UpdateUserValidator);
    const exists = await this.MODEL.findBy("id", request.param("id"));
    if (!exists) {
      return response.notFound({
        status: false,
        message: ResponseMessages.NOT_FOUND,
      });
    }

    // check to see if a user is eligible to update
    const user = auth.user;
    if (
      !(this.isSuperAdmin(user) || this.isAdmin(user) || user?.id === exists.id)
    ) {
      return response.forbidden({
        status: false,
        message: ResponseMessages.FORBIDDEN,
      });
    }
    await exists.merge(payload).save();
    if (payload.roles) {
      const roles: Role[] = await Role.query().whereIn("name", payload.roles);
      exists.related("roles").sync(roles.map((role) => role.id));
    }
    delete exists.$attributes.password;
    return response.send({
      status: true,
      message: "User updated",
      data: exists,
    });
  }

  public async find({ auth, request, response }: HttpContextContract) {
    if (!auth.user) {
      return response.unauthorized({ message: ResponseMessages.UNAUTHORIZED });
    }
    try {
      let baseQuery = Database.from("users")
        .select(
          "users.id",
          "parent_user_id",
          "first_name",
          "last_name",
          "email",
          "company_profiles.logo as company_logo",
          "company_profiles.name as company_name",
          "company_profiles.information",
          "company_profiles.created_at as company_create",
          "users.created_at"
        )
        .leftOuterJoin(
          "company_profiles",
          "company_profiles.user_id",
          "=",
          "users.id"
        )
        .where("users.id", "!=", auth.user.id);
      if (this.isAdmin(auth.user)) {
        baseQuery.where("parent_user_id", auth.user.id);
      }
      const roles = request.input("roles");
      if (roles && roles.length && !roles.includes("")) {
        baseQuery.whereExists(function (query) {
          query
            .select("*")
            .from("roles")
            .join("user_has_roles", "roles.id", "=", "user_has_roles.role_id")
            .whereRaw("user_has_roles.user_id = users.id")
            .whereIn("roles.name", roles);
        });
      }
      const usersList = (
        await baseQuery.paginate(
          request.input(Pagination.PAGE_KEY, Pagination.PAGE),
          request.input(Pagination.PER_PAGE_KEY, Pagination.PER_PAGE)
        )
      ).toJSON();
      const userIds = usersList.data.map((item) => item.id);
      const userRoles = await UserHasRole.query()
        .select("roles.id as role_id", "roles.name", "user_has_roles.user_id")
        .join("roles", "roles.id", "=", "user_has_roles.role_id")
        .whereIn("user_has_roles.user_id", userIds);
      for (const user of usersList.data) {
        user.company_logo = s3Link(user.company_logo);
        delete user.password;
        user.roles = userRoles
          .filter((item) => item.user_id === user.id)
          .map((item) => {
            return {
              role_id: item.role_id,
              name: item.name,
            };
          });
      }
      return response.send(usersList);
    } catch (e) {
      return response.internalServerError({
        status: false,
        message: e.toString(),
      });
    }
  }

  public async authenticated({ auth, response }: HttpContextContract) {
    const authenticatedUser = auth.user;
    if (!authenticatedUser) {
      return response.unauthorized({ message: ResponseMessages.UNAUTHORIZED });
    }
    delete authenticatedUser.$attributes.password;
    return response.send({ status: true, data: auth.user });
  }

  // public async index({ response }: HttpContextContract) {
  //   // const users = await User.all();
  //   const users = await User.query()
  //     .preload("roles", (roleQuery) => roleQuery.select("name", "id"))
  //     .preload("userProfile", (profileQuery) => {
  //       profileQuery.select(
  //         "first_name",
  //         "last_name",
  //         "profile_picture",
  //         "phone_number",
  //         "address",
  //         "city",
  //         "zipcode",
  //         "state",
  //         "country",
  //         "created_at",
  //         "updated_at"
  //       );
  //     });

  //   return response.ok({ result: users, message: "Users Find Successfully" });
  // }

  // public async create({ request, response }: HttpContextContract) {
  //   const { email, password } = await request.validate(RegistorValidator);
  //   const { first_name, last_name } = await request.validate(ProfileValidator);

  //   // find role
  //   let finnd_role: any;
  //   try {
  //     finnd_role = await Role.findByOrFail("name", "user");
  //   } catch (error) {
  //     Logger.error("Role not found at AuthController.register:\n%o", error);
  //     return response.abort({ message: "Account could not be created" });
  //   }
  //   // Create a new user
  //   const user = await User.create({
  //     email,
  //     password: password,
  //   });
  //   if (user) {
  //     // await user.related("roles").attach(finnd_role?.id);
  //     user.related("roles").sync([finnd_role?.id]);
  //     await user.related("userProfile").create({
  //       first_name,
  //       last_name,
  //     });
  //     const userService = new UserServices({ email });
  //     const fetchUser = await userService.getUserModel();
  //     return response.ok({
  //       message: "Account was created successfully.",
  //       result: fetchUser,
  //     });
  //   } else {
  //     Logger.error("User could not be created at AuthController.register");
  //     return response.abort({ message: "Account could not be created" });
  //   }
  //   // let newUser: any;
  //   // let newProfile: any;
  //   // let newRole: any;
  //   // if (ctx.params.userId) {
  //   //   newUser = await User.find(ctx.params.userId);
  //   // } else {
  //   //   const check_user_email = await User.findBy(
  //   //     "email",
  //   //     ctx.request.body().email
  //   //   );
  //   //   if (check_user_email) {
  //   //     return ctx.response.conflict({ message: "User Already Exist" });
  //   //   }
  //   //   newUser = new User();
  //   //   newProfile = new UserProfile();
  //   //   newRole = new Role();
  //   //   console.log("newRole", newRole);
  //   // }

  //   // newProfile.first_name = profile_payload?.first_name;
  //   // newProfile.last_name = profile_payload?.last_name;
  //   // newUser.email = regUser.email;
  //   // newUser.password = regUser.password;

  //   // // find role
  //   // let finnd_role: any;
  //   // try {
  //   //   debugger;
  //   //   finnd_role = await Role.findBy("name", "user");
  //   //   console.log("try find role", finnd_role);
  //   // } catch (error) {
  //   //   Logger.error("Role not found at UserController.register:\n%o", error);
  //   //   return ctx.response.abort({ message: "Account could not be created" });
  //   // }
  //   // console.log(finnd_role);
  //   // if (newUser) {
  //   //   await newUser.save();
  //   //   await newUser.related("rolesRelation").save(finnd_role?.id);
  //   //   await newUser.related("userProfile").save(newProfile);
  //   // }
  //   // console.log(newUser);
  //   // const userService = new UserServices({ email: regUser.email });
  //   // const fetchUser = await userService.getUserModel();

  //   // return ctx.response.ok({
  //   //   result: fetchUser,
  //   //   message: "Operation Successfully",
  //   // });
  // }
  // public async show({ params, response }: HttpContextContract) {
  //   const user = await User.find(params.userId);

  //   if (!user) {
  //     return response.notFound({ message: "User not found" });
  //   }
  //   return response.ok({ result: user, message: "User Find Successfully" });
  // }

  // public async delete({ params, response }: HttpContextContract) {
  //   const user = await User.find(params.userId);

  //   if (!user) {
  //     return response.notFound({ message: "User not found" });
  //   }

  //   await user.delete();

  //   return response.ok({ message: "User deleted successfully." });
  // }
}
