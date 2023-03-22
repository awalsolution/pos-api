import { DateTime } from "luxon";
import {
  column,
  BaseModel,
  manyToMany,
  ManyToMany,
} from "@ioc:Adonis/Lucid/Orm";
import User from "App/Models/User";
import Permission from "App/Models/Permission";

export default class Role extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public name: string;

  @column()
  public description: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  // @belongsTo(() => User)
  // public user: BelongsTo<typeof User>;

  @manyToMany(() => User, {
    pivotTable: "user_has_roles",
    pivotTimestamps: true,
  })
  public users: ManyToMany<typeof User>;

  @manyToMany(() => Permission, { pivotTable: "role_has_permissions" })
  public permissions: ManyToMany<typeof Permission>;
}
