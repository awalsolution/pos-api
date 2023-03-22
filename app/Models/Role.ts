import { DateTime } from "luxon";
import {
  column,
  BaseModel,
  manyToMany,
  ManyToMany,
  hasMany,
  HasMany,
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

  @hasMany(() => User)
  public users_relation: HasMany<typeof User>;

  @manyToMany(() => Permission)
  public permissions: ManyToMany<typeof Permission>;
}
