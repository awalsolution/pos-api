import { DateTime } from 'luxon';
import { column, BaseModel } from '@ioc:Adonis/Lucid/Orm';
import { STANDARD_DATE_TIME_FORMAT } from 'App/Helpers/utils';

export default class OrderItem extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public orderId: number | null;

  @column()
  public product_id: number;

  @column()
  public variant_id: number;

  @column()
  public product_sku: string;

  @column()
  public product_title: string;

  @column()
  public quantity: number;

  @column()
  public product_price: string;

  @column()
  public subtotal: string;

  @column()
  public product_image: string;

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
