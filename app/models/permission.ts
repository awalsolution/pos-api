import { DateTime } from 'luxon'
import {
  BaseModel,
  belongsTo,
  SnakeCaseNamingStrategy,
  column,
  manyToMany,
} from '@adonisjs/lucid/orm'
import type { ManyToMany, BelongsTo } from '@adonisjs/lucid/types/relations'
import Role from '#models/role'
import Menu from '#models/menu'

BaseModel.namingStrategy = new SnakeCaseNamingStrategy()

export default class Permission extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare menuId: number

  @column()
  declare name: string

  @column()
  declare type: string

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
}
