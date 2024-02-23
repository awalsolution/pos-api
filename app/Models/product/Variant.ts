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
import Product from 'App/Models/product/Product';
import Attribute from 'App/Models/product/Attribute';
import VariantImage from 'App/Models/product/VariantImage';

export default class Variant extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public productId: number | undefined;

  @column()
  public attributeId: number | undefined;

  @column()
  public sku_id: string;

  @column()
  public attribute_value: string;

  @column()
  public price: number;

  @column()
  public regular_price: number | null;

  @column()
  public status: string;

  @column()
  public sale_price: number | null;

  @column()
  public date_on_sale_from: DateTime | null;

  @column()
  public date_on_sale_to: DateTime | null;

  @column()
  public on_sale: Boolean;

  @column()
  public stock_quantity: number | null;

  @column()
  public stock_status: string;

  @column()
  public rating: number | null;

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

  @belongsTo(() => Attribute)
  public attributes: BelongsTo<typeof Attribute>;

  @belongsTo(() => Product)
  public products: BelongsTo<typeof Product>;

  @hasMany(() => VariantImage)
  public images: HasMany<typeof VariantImage>;
}
