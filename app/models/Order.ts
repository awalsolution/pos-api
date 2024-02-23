import { DateTime } from 'luxon';
import {
  column,
  BaseModel,
  belongsTo,
  BelongsTo,
  hasMany,
  HasMany,
} from '@ioc:Adonis/Lucid/Orm';
import { STANDARD_DATE_TIME_FORMAT } from 'App/Helpers/utils';
import User from 'App/Models/User';
import OrderItem from 'App/Models/OrderItem';
import PaymentMethod from 'App/Models/PaymentMethod';
import ShipmentAddress from 'App/Models/ShipmentAddress';

export default class Order extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public shop_id: number | null;

  @column()
  public user_id: number | null;

  @column()
  public shipment_address_id: number | null;

  @column()
  public payment_method_id: number | null;

  @column()
  public status: string;

  @column()
  public order_key: string;

  @column()
  public total: string;

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

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>;

  @belongsTo(() => ShipmentAddress)
  public address: BelongsTo<typeof ShipmentAddress>;

  @belongsTo(() => PaymentMethod)
  public payment_method: BelongsTo<typeof PaymentMethod>;

  @hasMany(() => OrderItem)
  public order_items: HasMany<typeof OrderItem>;
}
