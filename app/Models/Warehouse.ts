import { DateTime } from 'luxon';
import { column, BaseModel, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm';
import { STANDARD_DATE_TIME_FORMAT } from 'App/Helpers/utils';
import Shop from 'App/Models/Shop';

export default class Warehouse extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public shopId: number | undefined;

  @column()
  public warehouse_name: string;

  @column()
  public warehouse_phone: string;

  @column()
  public warehouse_status: string;

  @column()
  public warehouse_address: string;

  @column()
  public warehouse_city: string;

  @column()
  public warehouse_state: string;

  @column()
  public warehouse_country: string;

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
