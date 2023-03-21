import { schema, CustomMessages, rules } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class RegistorValidator {
  constructor(protected ctx: HttpContextContract) {}
  public refs = schema.refs({
    confirmPassword: this.ctx.request.body().password,
  });
  public schema = schema.create({
    email: schema.string({ escape: true, trim: true }, [
      rules.email(),
      rules.unique({
        column: "email",
        table: "users",
      }),
    ]),
    first_name: schema.string({ escape: true, trim: true }, [
      rules.maxLength(30),
    ]),
    last_name: schema.string.optional({ escape: true, trim: true }, [
      rules.maxLength(30),
    ]),
    password: schema.string({ escape: true, trim: true }, [rules.minLength(6)]),
    confirmPassword: schema.string({ escape: true, trim: true }, [
      rules.equalTo(this.refs.confirmPassword),
    ]),
    phone_number: schema.string.optional({ escape: true, trim: true }, [
      rules.mobile(),
    ]),
    address: schema.string.optional(),
    city: schema.string.optional(),
    state: schema.string.optional(),
    country: schema.string.optional(),
  });

  public messages: CustomMessages = {
    "email.required": "Email is required.",
    "email.email": "Email is not valid.",
    "email.unique": "This email is already used.",
    "firstName.required": "First Name is required.",
    "firstName.maxLength":
      "First Name should be maximum of {{options.choices}} characters.",
    "password.required": "Password is required.",
    "password.regex": "Please provide a greater then 6 characters password.",
    "confirmPassword.equalTo": "Both passwords should be the same.",
    "confirmPassword.required": "Confirm Password is required.",
    "phone_number.mobile": "Phone number is not valid",
  };
}
