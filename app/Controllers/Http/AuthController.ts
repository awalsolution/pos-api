import { DateTime } from "luxon";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Logger from "@ioc:Adonis/Core/Logger";
import Role from "App/Models/Role";
import User from "App/Models/User";
import RegistorValidator from "App/Validators/RegistorValidator";

export default class AuthController {
  public async register({ request, response }: HttpContextContract) {
    console.log(User);
    const form = await request.validate(RegistorValidator);
    const {
      email,
      first_name,
      last_name,
      password,
      phone_number,
      address,
      city,
      state,
      country,
    } = form;

    // Get the CompanyAdmin role
    let role: any;
    try {
      role = await Role.findByOrFail("name", "user");
    } catch (error) {
      Logger.error("Role not found at AuthController.register:\n%o", error);
      return response.abort({ message: "Account could not be created" });
    }

    // Create a new user
    const user = await User.create({
      email,
      password: password,
      is_account_activated: true,
      login_status: false,
      account_activated_at: DateTime.now(),
      roleId: role?.id ? role.id : "user",
    });
    if (user) {
      await user.related("user_profile_relation").create({
        first_name,
        last_name,
        phone_number,
        address,
        city,
        state,
        country,
      });

      // // Send verification email
      // Event.emit("auth::new-registration-verification", {
      //   user,
      // });

      // const token = await auth.use("api").attempt(email, password);
      // Check if credentials are valid, else return error
      // if (!token)
      //   throw new NoLoginException({
      //     message: "Email address or password is not correct.",
      //   });

      /* Retrieve user with company information */
      // const userService = new UserServices({ email });
      // const cachedUser = await userService.getUserSummary();

      /**
       * Emit event to log login activity and
       * persist login meta information to DB
       * Also Clean up login code information
       */
      // const ip = request.ip();
      // Event.emit("auth::new-login", {
      //   ip,
      //   user,
      // });

      return response.created({
        message: "Account was created successfully.",
        // token: token,
        data: user,
      });
    } else {
      Logger.error("User could not be created at AuthController.register");
      return response.abort({ message: "Account could not be created" });
    }
  }
  public async login({}: HttpContextContract) {}
}
