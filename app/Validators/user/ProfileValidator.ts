import { schema, CustomMessages, rules } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export class ProfileValidator {
  constructor(protected ctx: HttpContextContract) {}
  public schema = schema.create({
    first_name: schema.string([rules.required()]),
    last_name: schema.string.nullableAndOptional(),
    address: schema.string.nullableAndOptional(),
    city: schema.string.nullableAndOptional(),
    zipcode: schema.string.nullableAndOptional(),
    state: schema.string.nullableAndOptional(),
    country: schema.string.nullableAndOptional(),
    profile_picture: schema.string.nullableAndOptional(),
  });

  public messages: CustomMessages = {
    "first_name.required": "First Name is required.",
  };
}
