import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class AuthController {
  public async register({ request, response, auth }: HttpContextContract) {
    const form = await request.validate(RegistorValidator);
    const {
      email,
      firstName,
      middleName,
      lastName,
      newPassword,
      phoneNumber,
      address,
      city,
      stateId,
      countryId,
    } = form;

    // Get the CompanyAdmin role
    let companyAdminRole;
    try {
      companyAdminRole = await Role.findByOrFail("name", "CompanyAdmin");
    } catch (error) {
      Logger.error("Role not found at AuthController.register:\n%o", error);
      return response.abort({ message: "Account could not be created" });
    }

    // Create a new user
    const user = await User.create({
      email,
      password: newPassword,
      isAccountActivated: true,
      loginStatus: true,
      accountActivatedAt: DateTime.now(),
      roleId: companyAdminRole.id,
    });

    if (user) {
      await user.related("profile").create({
        firstName,
        middleName,
        lastName,
        phoneNumber,
        address,
        city,
        stateId,
        countryId,
      });

      // Send verification email
      Event.emit("auth::new-registration-verification", {
        user,
      });

      const token = await auth.use("api").attempt(email, newPassword);
      // Check if credentials are valid, else return error
      if (!token)
        throw new NoLoginException({
          message: "Email address or password is not correct.",
        });

      /* Retrieve user with company information */
      const userService = new UserServices({ email });
      const cachedUser = await userService.getUserSummary();

      /**
       * Emit event to log login activity and
       * persist login meta information to DB
       * Also Clean up login code information
       */
      const ip = request.ip();
      Event.emit("auth::new-login", {
        ip,
        user,
      });

      return response.created({
        message: "Account was created successfully.",
        token: token,
        data: cachedUser,
      });
    } else {
      Logger.error("User could not be created at AuthController.register");
      return response.abort({ message: "Account could not be created" });
    }
  }
  public async login({}: HttpContextContract) {}
}
