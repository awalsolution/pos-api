import { DateTime } from 'luxon';
import { BaseModel, HasMany, column, hasMany } from '@ioc:Adonis/Lucid/Orm';
import { STANDARD_DATE_TIME_FORMAT } from 'App/Helpers/utils';
import Variation from './Variation';

export default class Attribute extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public name: string;

  @column()
  public status: boolean;

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
}
