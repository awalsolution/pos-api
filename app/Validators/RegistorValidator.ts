import { schema, CustomMessages, rules } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class RegistorValidator {
  constructor(protected ctx: HttpContextContract) {}
  public schema = schema.create({
    email: schema.string({ escape: true, trim: true }, [
      rules.email(),
      rules.unique({
        column: "email",
        table: "users",
      }),
    ]),
    password: schema.string({ escape: true, trim: true }, [
      rules.minLength(6),
      rules.confirmed("confirmPassword"),
    ]),
  });

  public messages: CustomMessages = {
    "email.required": "Email is required.",
    "email.email": "Email is not valid.",
    "email.unique": "This email is already used.",
    "password.required": "Password is required.",
    "password.regex": "Please provide a greater then 6 characters password.",
    "confirmPassword.equalTo": "Both passwords should be the same.",
    "confirmPassword.required": "Confirm Password is required.",
  };
}
