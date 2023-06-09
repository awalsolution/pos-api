import { DateTime } from 'luxon';
import { column, BaseModel } from '@ioc:Adonis/Lucid/Orm';
import { STANDARD_DATE_TIME_FORMAT } from 'App/Helpers/utils';
import { slugify } from '@ioc:Adonis/Addons/LucidSlugify';

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public shopId: number | undefined;

  @column()
  public title: string;

  @column()
  @slugify({
    strategy: 'dbIncrement',
    fields: ['title'],
    allowUpdates: true,
  })
  public slug: string;

  @column()
  type: string;

  @column()
  status: string;

  @column()
  featured: Boolean;

  @column()
  public description: string | null;

  @column()
  public product_sku: string;

  @column()
  public price: number;

  @column()
  public regular_price: number;

  @column()
  public sale_price: number | null;

  @column()
  public date_on_sale_from: DateTime | null;

  @column()
  public date_on_sale_to: DateTime | null;

  @column()
  public on_sale: Boolean;

  @column()
  public total_sales: number | null;

  @column()
  public stock_status: string;

  @column()
  public rating: string | null;

  @column()
  public categories: string | null;

  @column()
  public variations: string | null;

  @column()
  public default_attributes: string | null;

  @column()
  public product_images: string | null;

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
