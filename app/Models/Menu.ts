import { DateTime } from 'luxon';
import { column, BaseModel } from '@ioc:Adonis/Lucid/Orm';
import { STANDARD_DATE_TIME_FORMAT } from 'App/Helpers/utils';

export default class Menu extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public parent_id: number | null;

  @column()
  public route_name: string;

  @column()
  public menu_url: string;

  @column()
  public menu_name: string;

  @column()
  public menu_order: number;

  @column()
  public menu_icon: string | null;

  @column()
  public is_parent: boolean | null;

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
}
