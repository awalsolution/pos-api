import { DateTime } from 'luxon'
import { BaseModel, SnakeCaseNamingStrategy, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Permission from '#models/permission'

BaseModel.namingStrategy = new SnakeCaseNamingStrategy()

export default class Menu extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare permissionId: number | null

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

  @hasMany(() => Permission)
  declare permissions: HasMany<typeof Permission>
}
