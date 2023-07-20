import { DateTime } from 'luxon';
import {
  column,
  BaseModel,
  hasMany,
  HasMany,
  belongsTo,
  BelongsTo,
} from '@ioc:Adonis/Lucid/Orm';
import { STANDARD_DATE_TIME_FORMAT } from 'App/Helpers/utils';
import { slugify } from '@ioc:Adonis/Addons/LucidSlugify';
import Variation from 'App/Models/product/Variation';
import Shop from 'App/Models/Shop';

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public shopId: number | undefined;

  @column()
  public categoryId: number | undefined;

  @column()
  public product_code: string;

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
  public status: string;

  @column()
  public description: string | null;

  @column()
  public product_image: string | null;

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

  @hasMany(() => Variation)
  public variations: HasMany<typeof Variation>;

  @belongsTo(() => Shop)
  public shop: BelongsTo<typeof Shop>;
}
