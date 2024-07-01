import { DateTime } from 'luxon'
import { BaseModel, SnakeCaseNamingStrategy, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Plan from '#models/plan'

BaseModel.namingStrategy = new SnakeCaseNamingStrategy()

export default class Tenant extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare planId: number | null

  @column()
  declare domain_name: string

  @column()
  declare tenant_name: string

  @column()
  declare db_name: string

  @column()
  declare tenant_api_key: string

  @column()
  declare status: boolean

  @column()
  declare created_by: string | null

  @column()
  declare first_name: string

  @column()
  declare last_name: string | null

  @column()
  declare email: string | null

  @column()
  declare phone_number: string | null

  @column()
  declare address: string | null

  @column()
  declare city: string | null

  @column()
  declare state: string | null

  @column()
  declare country: string | null

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

  @belongsTo(() => Plan)
  declare plan: BelongsTo<typeof Plan>
}
