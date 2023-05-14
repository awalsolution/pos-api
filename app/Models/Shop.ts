import { DateTime } from 'luxon';
import { column, BaseModel, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm';
import { STANDARD_DATE_TIME_FORMAT } from 'App/Helpers/utils';
import Product from 'App/Models/Product';

export default class Shop extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public userId: number | undefined;

  @column()
  public shop_name: string;

  @column()
  public shop_phone: string | null;

  @column()
  public status: boolean;

  @column()
  public address: string | null;

  @column()
  public city: string | null;

  @column()
  public state: string | null;

  @column()
  public country: string | null;

  @column()
  public shop_logo: string | null;

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

  @hasMany(() => Product)
  public products: HasMany<typeof Product>;
}
