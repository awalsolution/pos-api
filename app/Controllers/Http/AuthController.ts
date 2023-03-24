// import { DateTime } from "luxon";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Logger from "@ioc:Adonis/Core/Logger";
import Role from "App/Models/Role";
import User from "App/Models/User";
import RegistorValidator from "App/Validators/RegistorValidator";
import UserServices from "App/services/UserServices";
import ProfileValidator from "App/Validators/ProfileValidator";

export default class AuthController {
  public async register({ request, response }: HttpContextContract) {
    const { email, password } = await request.validate(RegistorValidator);
    const {
      first_name,
      last_name,
      phone_number,
      address,
      city,
      state,
      country,
    } = await request.validate(ProfileValidator);

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
      await user.related("roles").attach(finnd_role?.id);
      await user.related("userProfile").create({
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

      /* Retrieve user with company information */
      const userService = new UserServices({ email });
      const fetchUser = await userService.getUserModel();
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
        result: fetchUser,
      });
    } else {
      Logger.error("User could not be created at AuthController.register");
      return response.abort({ message: "Account could not be created" });
    }
  }

  public async login({ request, auth, response }: HttpContextContract) {
    const { password, email } = request.body();

    await User.findByOrFail("email", email);

    try {
      const token = await auth.use("api").attempt(email, password);
      const userService = new UserServices({ email: email });
      await userService.getUserModel();
      const fullUserInfo = await userService.get_user_full_profile();
      return response.ok({
        message: "Login Successfully.",
        token: token,
        result: fullUserInfo,
      });
    } catch (error) {
      return response.unauthorized(error);
    }
  }
}
