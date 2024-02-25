import { DateTime } from 'luxon';
import Hash from '@ioc:Adonis/Core/Hash';
import {
  column,
  beforeSave,
  BaseModel,
  hasOne,
  HasOne,
} from '@ioc:Adonis/Lucid/Orm';
import { STANDARD_DATE_TIME_FORMAT } from 'App/Helpers/utils';
import CustomerProfile from 'App/Models/CustomerProfile';

export default class Customer extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public shop_id: number | null;

  @column()
  public email: string;

  @column()
  public user_type: string;

  @column()
  public status: boolean;

  @column({ serializeAs: null })
  public password: string;

  @column()
  public is_email_verified: boolean;

  @column()
  public email_verified_at: string;

  @column()
  public rememberToken: boolean;

  @column()
  public is_phone_verified: boolean;

  @column()
  public phone_verified_at: string | null;

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

  @beforeSave()
  public static async hashPassword(customer: Customer) {
    if (customer.$dirty.password) {
      customer.password = await Hash.make(customer.password);
    }
  }

  @hasOne(() => CustomerProfile)
  public customer_profile: HasOne<typeof CustomerProfile>;
}
