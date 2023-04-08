import { DateTime } from "luxon";
import { column, BaseModel, HasMany, hasMany } from "@ioc:Adonis/Lucid/Orm";
import User from "App/Models/User";
import { STANDARD_DATE_TIME_FORMAT } from "App/Helpers/utils";

export default class Shop extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public shop_name: string;

  @column()
  public shop_phone: string | null;

  @column()
  public address: string | null;

  @column()
  public city: string | null;

  @column()
  public zipcode: string | null;

  @column()
  public state: string | null;

  @column()
  public country: string | null;

  @column()
  public shop_logo: string | null;

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

  // Relations
  @hasMany(() => User, {
    localKey: "id",
    foreignKey: "user_id",
  })
  public user: HasMany<typeof User>;
}
