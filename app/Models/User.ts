import { DateTime } from "luxon";
import Hash from "@ioc:Adonis/Core/Hash";
import { column, beforeSave, BaseModel } from "@ioc:Adonis/Lucid/Orm";

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
  public banned: boolean;

  @column()
  public login_status: boolean;

  @column()
  public is_email_verified: boolean;

  @column()
  public forgot_password_code: number;

  @column()
  public rememberMeToken: string | null;

  @column()
  public activation_code: string | null;

  @column()
  public last_login_time: DateTime | null;

  @column()
  public account_activated_at: DateTime | null;

  @column()
  public email_verified_at: DateTime | null;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password);
    }
  }
}
