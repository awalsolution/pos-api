import { DateTime } from "luxon";
import {
  column,
  BaseModel,
  manyToMany,
  ManyToMany,
} from "@ioc:Adonis/Lucid/Orm";
import User from "App/Models/User";
import Permission from "App/Models/Acl/Permission";
import { STANDARD_DATE_TIME_FORMAT } from "App/Helpers/utils";

export default class Role extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public name: string;

  @column()
  public description: string;

  @column.dateTime({
    autoCreate: true,
    serialize(value: DateTime) {
      return value ? value.toFormat(STANDARD_DATE_TIME_FORMAT) : "";
    },
  })
  public createdAt: DateTime;

  @column.dateTime({
    autoCreate: true,
    autoUpdate: true,
    serialize(value: DateTime) {
      return value ? value.toFormat(STANDARD_DATE_TIME_FORMAT) : "";
    },
  })
  public updatedAt: DateTime;

  @manyToMany(() => User, {
    pivotTable: "user_has_roles",
    pivotTimestamps: true,
    localKey: "id",
    pivotForeignKey: "role_id",
    relatedKey: "id",
    pivotRelatedForeignKey: "user_id",
  })
  public users: ManyToMany<typeof User>;

  @manyToMany(() => Permission, { pivotTable: "role_has_permissions" })
  public permissions: ManyToMany<typeof Permission>;
}
