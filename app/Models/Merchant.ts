import { DateTime } from 'luxon';
import { column, BaseModel, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm';
import { STANDARD_DATE_TIME_FORMAT } from 'App/Helpers/utils';
import Shop from 'App/Models/Shop';

export default class Merchant extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public shopId: number | undefined;

  @column()
  public merchant_name: string;

  @column()
  public status: string;

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
}
