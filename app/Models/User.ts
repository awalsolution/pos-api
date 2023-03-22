import { DateTime } from "luxon";
import {
  column,
  beforeSave,
  BaseModel,
  beforeCreate,
  hasOne,
  HasOne,
} from "@ioc:Adonis/Lucid/Orm";
import UserHook from "./hooks/UserHook";
import UserProfile from "App/Models/UserProfile";
const STANDARD_DATE_TIME_FORMAT = "yyyy-LL-dd HH:mm:ss";

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public roleId: number;

  @column()
  public email: string;

  @column({ serializeAs: null })
  public password: string;

  @column()
  public is_account_activated: boolean;

  @column()
  public remember_token: string | null;

  @column()
  public banned: boolean;

  @column()
  public activation_code: string | null;

  @column()
  public login_status: boolean;

  @column()
  public forgot_password_code: number | null;

  @column()
  public is_email_verified: boolean;

  @column()
  public last_login_time: DateTime | null;

  @column.dateTime({
    serialize(value: DateTime) {
      return value ? value.toFormat(STANDARD_DATE_TIME_FORMAT) : "";
    },
  })
  public account_activated_at: DateTime | null;

  @column()
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
    UserHook.generateActivationCode(user);
  }

  @beforeSave()
  public static hashPassword(user: User) {
    UserHook.hashPassword(user);
  }
  @hasOne(() => UserProfile)
  public user_profile_relation: HasOne<typeof UserProfile>;
}
