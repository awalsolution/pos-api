import Hash from "@ioc:Adonis/Core/Hash";
import { BaseController } from "App/Controllers/BaseController";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Role from "App/Models/Acl/Role";
import User from "App/Models/User";
import { RegistorValidator } from "App/Validators/user/RegistorValidator";
import ResponseMessages from "App/Enums/ResponseMessages";
import OldPasswordResetValidator from "App/Validators/user/OldPasswordResetValidator";

export default class AuthController extends BaseController {
  public MODEL: typeof User;

  constructor() {
    super();
    this.MODEL = User;
  }

  public async register({ request, response }: HttpContextContract) {
    const payload = await request.validate(RegistorValidator);
    try {
      let user = await this.MODEL.findBy("email", request.body().email);
      if (user && !user.isEmailVerified) {
        delete user.$attributes.password;
        return response.conflict({
          status: false,
          message: "Already exists",
          result: { user: user, verified: false },
        });
      }
      user = await this.MODEL.create(payload);
      const adminRole = await Role.findBy("name", "user");
      if (adminRole) {
        user.related("roles").sync([adminRole.id]);
      }
      delete user.$attributes.password;
      return response.send({
        status: true,
        message: "Register Successfully",
        result: user,
      });
    } catch (e) {
      console.log("register error", e.toString());
      return response.internalServerError({
        status: false,
        message: e.toString(),
      });
    }
  }
  public async login({ auth, request, response }: HttpContextContract) {
    try {
      const token = await auth
        .use("api")
        .attempt(request.input("email"), request.input("password"));
      return {
        status: true,
        result: {
          user: auth.user,
          token: token.token,
        },
        message: "Login Successfully",
      };
    } catch (e) {
      console.log(e);
      return response.badRequest("Invalid credentials");
    }
  }

  public async logout({ auth }: HttpContextContract) {
    return auth.use("api").logout();
  }

  public async resetPasswordUsingOldPassword({
    auth,
    request,
    response,
  }: HttpContextContract) {
    if (!auth.user) {
      return response.unauthorized({ message: ResponseMessages.UNAUTHORIZED });
    }
    const payload = await request.validate(OldPasswordResetValidator);
    const passwordMatched = await Hash.verify(
      auth.user.password,
      payload.oldPassword
    );
    if (passwordMatched) {
      const user = await User.findBy("id", auth.user.id);
      if (user) {
        await user
          .merge({
            password: payload.password,
          })
          .save();
        return response.send({ message: "Password changed" });
      }
      return response.notFound({ message: "User" });
    }
    return response.notAcceptable({ message: "Wrong password" });
  }
}
