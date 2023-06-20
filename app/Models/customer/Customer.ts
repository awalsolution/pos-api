import { DateTime } from 'luxon';
import {
  column,
  BaseModel,
  hasMany,
  HasMany,
  belongsTo,
  BelongsTo,
} from '@ioc:Adonis/Lucid/Orm';
import { STANDARD_DATE_TIME_FORMAT } from 'App/Helpers/utils';
import CustomerAddress from 'App/Models/customer/CustomerAddress';
import Shop from 'App/Models/Shop';

export default class Customer extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public shopId: number | undefined;

  @column()
  public email: string;

  @column()
  public phone: string;

  @column()
  public status: boolean;

  @column()
  public firstName: string;

  @column()
  public lastName: string | null;

  @column({ serializeAs: null })
  public password: string;

  @column()
  public userType: string;

  @column()
  public rememberToken: boolean;

  @column()
  public isEmailVerified: boolean;

  @column()
  public isPhoneVerified: boolean;

  @column()
  public profilePicture: string | null;

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

  @belongsTo(() => Shop)
  public shop: BelongsTo<typeof Shop>;

  @hasMany(() => CustomerAddress)
  public customer_addresses: HasMany<typeof CustomerAddress>;
}
