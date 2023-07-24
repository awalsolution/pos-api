import { DateTime } from 'luxon';
import {
  column,
  BaseModel,
  belongsTo,
  BelongsTo,
  hasOne,
  HasOne,
} from '@ioc:Adonis/Lucid/Orm';
import { STANDARD_DATE_TIME_FORMAT } from 'App/Helpers/utils';
import Shop from 'App/Models/Shop';
import ShippingAddress from 'App/Models/customer/ShippingAddress';
import BillingAddress from 'App/Models/customer/BillingAddress';
import CustomerProfile from 'App/Models/customer/CustomerProfile';

export default class Customer extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public shopId: number | undefined;

  @column()
  public email: string;

  @column()
  public status: boolean;

  @column({ serializeAs: null })
  public password: string;

  @column()
  public rememberToken: boolean;

  @column()
  public isEmailVerified: boolean;

  @column()
  public isPhoneVerified: boolean;

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

  @hasOne(() => ShippingAddress)
  public shipping_address: HasOne<typeof ShippingAddress>;

  @hasOne(() => BillingAddress)
  public billing_address: HasOne<typeof BillingAddress>;

  @hasOne(() => CustomerProfile)
  public profile: HasOne<typeof CustomerProfile>;
}
