import { DateTime } from 'luxon'
import { BaseModel, SnakeCaseNamingStrategy, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Supplier from '#models/tenant/supplier'

BaseModel.namingStrategy = new SnakeCaseNamingStrategy()

export default class SupplierAddress extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare supplierId: number

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
  declare isDefault: boolean | null

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

  @belongsTo(() => Supplier)
  declare supplier: BelongsTo<typeof Supplier>
}
