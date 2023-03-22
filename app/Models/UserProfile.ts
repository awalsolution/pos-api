import { DateTime } from "luxon";
import {
  BaseModel,
  column,
  belongsTo,
  BelongsTo,
  computed,
} from "@ioc:Adonis/Lucid/Orm";
import User from "App/Models/User";
// import UploadedFile from "App/Models/UploadedFile";

export default class UserProfile extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public userId: number;

  @column()
  public first_name: string;

  @column()
  public last_name: string;

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

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @computed()
  public get full_name() {
    return `${
      this.last_name ? this.first_name + " " + this.last_name : this.first_name
    }`;
  }

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>;

  @belongsTo(() => UploadedFile, { foreignKey: "profile_picture" })
  public profilePictureFile: BelongsTo<typeof UploadedFile>;
}
