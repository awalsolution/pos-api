import { schema, CustomMessages, rules } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class UpdateUserValidator {
  constructor(protected ctx: HttpContextContract) {}
  public schema = schema.create({
    first_name: schema.string.optional(),
    last_name: schema.string.optional(),
    // email: schema.string.optional([
    //   rules.email(),
    //   rules.unique({
    //     table: "users",
    //     column: "email",
    //     whereNot: {
    //       id: this.ctx.request.param("id"),
    //     },
    //   }),
    // ]),
    // password: schema.string.optional(),
    password: schema.string.optional([
      rules.minLength(6),
      rules.confirmed("confirmPassword"),
    ]),
    roles: schema.array.optional().members(schema.string()),
  });
  public messages: CustomMessages = {
    "email.string": "Email field must be of data type string",
    "email.email": "Email field must be valid email",
    "email.unique": "Email is already in use",
    "first_name.string": "First Name field must be of data type string",
    "last_name.string": "Last Name field must be of data type string",
    "last_name.password": "Last Name field must be of data type string",
    "roles.array": "Roles field must be an array of strings",
    "roles.*.string": "{{ field }} must be of data type string",
  };
}
