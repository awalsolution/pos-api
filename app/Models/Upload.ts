import { DateTime } from 'luxon';
import {
  BaseModel,
  column,
  beforeSave,
  afterFind,
  afterFetch,
  hasMany,
  HasMany,
} from '@ioc:Adonis/Lucid/Orm';
// import FileProvider from "App/Models/FileProvider";
import UserProfile from 'App/Models/Profile';
import { STANDARD_DATE_TIME_FORMAT } from 'App/Helpers/utils';

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
  | 'user_profile_picture'
  | 'company_logo'
  | 'customer_logo'
  | 'product_gallery_image'
  | 'category_header_image';

export default class Upload extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public userId: string;

  @column()
  public name: string | null;

  @column()
  public url: string | null;

  @column()
  public previewUrl: string | null;

  @column()
  public extension: string | null;

  @column()
  public formats: FileFormats | string | null;

  @column()
  public usage_type: FileUsageType;

  @column.dateTime({
    autoCreate: true,
    serialize(value: DateTime) {
      return value ? value.toFormat(STANDARD_DATE_TIME_FORMAT) : '';
    },
  })
  public createdAt: DateTime;

  @column.dateTime({
    autoCreate: true,
    autoUpdate: true,
    serialize(value: DateTime) {
      return value ? value.toFormat(STANDARD_DATE_TIME_FORMAT) : '';
    },
  })
  public updatedAt: DateTime;

  @hasMany(() => UserProfile, {
    foreignKey: 'profile_picture',
    onQuery: (query) => query.where('usage_type', 'user_profile_picture'),
  })
  public uploads: HasMany<typeof UserProfile>;

  @beforeSave()
  public static async stringifyFormats(file: Upload) {
    if (file.$dirty.formats && file.formats !== undefined) {
      file.formats = JSON.stringify(file.formats);
    }
  }

  @afterFind()
  public static async parseFormats(file: Upload) {
    file.formats = JSON.parse(file.formats as string);
  }

  @afterFetch()
  public static async parseAllFormats(files: Upload[]) {
    files.map((file) => {
      file.formats = JSON.parse(file.formats as string);
      return file;
    });
  }
}
