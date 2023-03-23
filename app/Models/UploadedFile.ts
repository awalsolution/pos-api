import { DateTime } from "luxon";
import {
  BaseModel,
  column,
  beforeSave,
  afterFind,
  afterFetch,
  hasMany,
  HasMany,
} from "@ioc:Adonis/Lucid/Orm";
// import FileProvider from "App/Models/FileProvider";
import UserProfile from "App/Models/UserProfile";
import { STANDARD_DATE_TIME_FORMAT } from "App/Helpers/utils";

export type FormatAttributes = {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  width: number;
  height: number;
  size: number;
  path: string | null;
  url: string;
};

export type FileFormats = {
  thumbnail: FormatAttributes;
  large: FormatAttributes;
  medium: FormatAttributes;
  small: FormatAttributes;
};

export type FileUsageType =
  | "user_profile_picture"
  | "company_logo"
  | "customer_logo"
  | "product_gallery_image"
  | "category_header_image";

export default class UploadedFile extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public userId: string;

  @column()
  public name: string;

  @column()
  public url: string;

  @column()
  public previewUrl: string;

  @column()
  public extension: string;

  @column()
  public hash: string;

  @column()
  public formats: FileFormats | string | null;

  @column()
  public public: boolean;

  @column()
  public deleted_at: DateTime;

  @column()
  public usage_type: FileUsageType;

  @column()
  public caption: string;

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

  @hasMany(() => UserProfile, {
    foreignKey: "profile_picture",
    onQuery: (query) => query.where("usage_type", "user_profile_picture"),
  })
  public user_profile_picture_relation: HasMany<typeof UserProfile>;

  @beforeSave()
  public static async stringifyFormats(file: UploadedFile) {
    if (file.$dirty.formats && file.formats !== undefined) {
      file.formats = JSON.stringify(file.formats);
    }
  }

  @afterFind()
  public static async parseFormats(file: UploadedFile) {
    file.formats = JSON.parse(file.formats as string);
  }

  @afterFetch()
  public static async parseAllFormats(files: UploadedFile[]) {
    files.map((file) => {
      file.formats = JSON.parse(file.formats as string);
      return file;
    });
  }
}
