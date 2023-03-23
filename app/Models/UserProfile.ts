import { DateTime } from "luxon";
import { BaseModel, column, belongsTo, BelongsTo } from "@ioc:Adonis/Lucid/Orm";
import User from "App/Models/User";
import Upload from "App/Models/Upload";
import { STANDARD_DATE_TIME_FORMAT } from "App/Helpers/utils";

export default class UserProfile extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public userId: number;

  @column()
  public first_name: string | null;

  @column()
  public last_name: string | null;

  @column()
  public phone_number: string | null;

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
  public profile_picture: number | null;

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

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>;

  @belongsTo(() => Upload, { foreignKey: "profile_picture" })
  public userProfilePicture: BelongsTo<typeof Upload>;
}
