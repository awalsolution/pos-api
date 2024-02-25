import { DateTime } from 'luxon';
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm';
import { STANDARD_DATE_TIME_FORMAT } from 'App/Helpers/utils';

export default class CustomerProfile extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public customerId: number | undefined;

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
  public state: string | null;

  @column()
  public country: string | null;

  @column()
  public profile_picture: string | null;

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
}
