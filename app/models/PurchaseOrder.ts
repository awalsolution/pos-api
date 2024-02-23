import { DateTime } from 'luxon';
import { column, BaseModel, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm';
import { STANDARD_DATE_TIME_FORMAT } from 'App/Helpers/utils';
import Shop from 'App/Models/Shop';
import Warehouse from 'App/Models/Warehouse';
import Merchant from 'App/Models//Merchant';
import Supplier from 'App/Models/Supplier';
import User from 'App/Models/User';

export default class PurchaseOrder extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public shopId: number | undefined;

  @column()
  public userId: number | undefined;

  @column()
  public warehouseId: number | undefined;

  @column()
  public merchantId: number | undefined;

  @column()
  public supplierId: number | undefined;

  @column()
  public ref_no: string;

  @column.dateTime({
    serialize: (value: DateTime | null) => {
      if (value instanceof DateTime) {
        return value.toFormat('EEE, LLL d yyyy');
      }
      return value;
    },
  })
  public expected_date: DateTime | null;

  @column()
  public status: string;

  @column()
  public order_type: string;

  @column()
  public notes: string | null;

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

  @belongsTo(() => Warehouse)
  public warehouse: BelongsTo<typeof Warehouse>;

  @belongsTo(() => Merchant)
  public merchant: BelongsTo<typeof Merchant>;

  @belongsTo(() => Supplier)
  public supplier: BelongsTo<typeof Supplier>;

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>;
}
