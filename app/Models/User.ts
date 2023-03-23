import { DateTime } from "luxon";
import crypto from "crypto";
import Hash from "@ioc:Adonis/Core/Hash";
import {
  column,
  beforeSave,
  BaseModel,
  beforeCreate,
  hasOne,
  HasOne,
  ManyToMany,
  manyToMany,
} from "@ioc:Adonis/Lucid/Orm";
import Role from "App/Models/Role";
import UserProfile from "App/Models/UserProfile";
import { STANDARD_DATE_TIME_FORMAT } from "App/Helpers/utils";

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public email: string;

  @column({ serializeAs: null })
  public password: string;

  @column()
  public is_account_activated: boolean;

  @column()
  public remember_token: boolean | null;

  @column()
  public activation_code: string | null;

  @column()
  public forgot_password_code: number | null;

  @column()
  public is_email_verified: boolean;

  @column.dateTime({
    serialize(value: DateTime) {
      return value ? value.toFormat(STANDARD_DATE_TIME_FORMAT) : "";
    },
  })
  public email_verified_at: DateTime | null;

  @column.dateTime({
    autoCreate: true,
    serialize(value: DateTime) {
      return value ? value.toFormat(STANDARD_DATE_TIME_FORMAT) : "";
    },
  })
  public createdAt: DateTime;

  @column.dateTime({
    autoCreate: true,
    autoUpdate: true,
    serialize(value: DateTime) {
      return value ? value.toFormat(STANDARD_DATE_TIME_FORMAT) : "";
    },
  })
  public updatedAt: DateTime;

  @beforeCreate()
  public static generateActivationCode(user: User) {
    user.activation_code = crypto.randomBytes(3).toString("hex");
  }

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password);
    }
  }

  @manyToMany(() => Role, {
    pivotTable: "user_has_roles",
    pivotTimestamps: true,
  })
  public roles: ManyToMany<typeof Role>;

  @hasOne(() => UserProfile)
  public userProfile: HasOne<typeof UserProfile>;
}
