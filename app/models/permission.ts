import { DateTime } from 'luxon'
import {
  BaseModel,
  SnakeCaseNamingStrategy,
  belongsTo,
  column,
  manyToMany,
} from '@adonisjs/lucid/orm'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import Menu from '#models/menu'
import Role from '#models/role'
import Plan from '#models/plan'

BaseModel.namingStrategy = new SnakeCaseNamingStrategy()

export default class Permission extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare menuId: number | null

  @column()
  declare name: string

  @column()
  declare type: string

  @column()
  declare status: boolean | number

  @column()
  declare created_by: string

  @column.dateTime({
    autoCreate: true,
    serialize: (value) => value?.toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY),
  })
  declare createdAt: DateTime

  @column.dateTime({
    autoCreate: true,
    autoUpdate: true,
    serialize: (value) => value?.toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY),
  })
  declare updatedAt: DateTime

  // relation
  @belongsTo(() => Menu)
  declare menus: BelongsTo<typeof Menu>

  @manyToMany(() => Role, {
    pivotTable: 'role_has_permissions',
    pivotTimestamps: true,
    localKey: 'id',
    pivotForeignKey: 'permission_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'role_id',
  })
  declare roles: ManyToMany<typeof Role>

  @manyToMany(() => Plan, {
    pivotTable: 'plan_has_permissions',
    pivotTimestamps: true,
    localKey: 'id',
    pivotForeignKey: 'permission_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'plan_id',
  })
  declare plans: ManyToMany<typeof Plan>
}
