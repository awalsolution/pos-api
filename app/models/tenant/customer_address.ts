import { DateTime } from 'luxon'
import { BaseModel, SnakeCaseNamingStrategy, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Customer from '#models/tenant/customer'

BaseModel.namingStrategy = new SnakeCaseNamingStrategy()

export default class CustomerAddress extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare customerId: number | null

  @column()
  declare street: string | null

  @column()
  declare city: string | null

  @column()
  declare state: string | null

  @column()
  declare zip: string | null

  @column()
  declare country: string | null

  @column()
  declare is_default: boolean | null

  @column()
  declare type: string | null

  @column()
  declare status: boolean | null

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

  @belongsTo(() => Customer)
  declare customer: BelongsTo<typeof Customer>
}
