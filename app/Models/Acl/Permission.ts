import { DateTime } from 'luxon';
import {
  BaseModel,
  column,
  manyToMany,
  ManyToMany,
} from '@ioc:Adonis/Lucid/Orm';
import Role from 'App/Models/Acl/Role';
import { STANDARD_DATE_TIME_FORMAT } from 'App/Helpers/utils';

export default class Permission extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public menuId: number;

  @column()
  public name: string;

  @column()
  public type: string;

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

  @manyToMany(() => Role, {
    pivotTable: 'role_has_permissions',
    pivotTimestamps: true,
    localKey: 'id',
    pivotForeignKey: 'permission_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'role_id',
  })
  public roles: ManyToMany<typeof Role>;
}
