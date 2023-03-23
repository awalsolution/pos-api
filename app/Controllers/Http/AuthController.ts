// import { DateTime } from "luxon";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Logger from "@ioc:Adonis/Core/Logger";
import Role from "App/Models/Role";
import User from "App/Models/User";
import RegistorValidator from "App/Validators/RegistorValidator";
import NoLoginException from "App/Exceptions/NoLoginException";
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
      // if (!token) {
      //   throw new NoLoginException({
      //     message: "Email address or password is not correct.",
      //   });
      // } else {
      //   await User.create({ login_status: true });
      // }
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
        // token: token,
        data: fetchUser,
      });
    } else {
      Logger.error("User could not be created at AuthController.register");
      return response.abort({ message: "Account could not be created" });
    }
  }

  public async login({ request, auth, response }: HttpContextContract) {
    const { password, email } = request.body();
    //const loginRecaptchaHelper = new LoginRecaptchaHelper(recaptchaResponseToken);

    const userService = new UserServices({ email: email });

    let user = await userService.getUserModel();

    if (!user) {
      response.created({
        message: "Your account is not register",
        error: response.notFound(),
        status: response.status(400),
      });
      // throw new NoLoginException({
      //   message: "Your account is not register",
      // });
    } else {
      // Get activation status
      const activationStatus = Boolean(user.is_account_activated);
      if (!activationStatus) {
        response
          .status(400)
          .notFound(
            "Your account is not activated. Please activate your account with the activation link sent to you via email."
          );

        // throw new NoLoginException({
        //   message:
        //     "Your account is not activated. Please activate your account with the activation link sent to you via email.",
        // });
      }

      let token: any;
      token = await auth.use("api").attempt(email, password);

      // Check if credentials are valid, else return error
      if (!token)
        throw new NoLoginException({
          message: "Email address or password is not correct.",
        });

      /* Retrieve user profile information */

      const fullUserInfo = await userService.get_user_full_profile();

      //console.log(user)

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
        message: "Login Successfully.",
        token: token,
        data: fullUserInfo,
      });
    }
  }
}
