import { DateTime } from 'luxon'
import { BaseModel, SnakeCaseNamingStrategy, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Supplier from '#models/tenant/supplier'
import PurchaseItem from '#models/tenant/purchase_item'
import User from '#models/user'

BaseModel.namingStrategy = new SnakeCaseNamingStrategy()

export default class Purchase extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare supplierId: number

  @column()
  declare invoice_no: number | null

  @column()
  declare gst: number | null

  @column()
  declare shipping_amount: number | null

  @column()
  declare total_items: number | null

  @column()
  declare total_qty: number | null

  @column()
  declare total_amount: number | null

  @column()
  declare notes: string | null

  @column()
  declare status: string

  @column.dateTime({
    autoCreate: true,
    serialize: (value) => value?.toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY),
  })
  // @no-swagger
  declare createdAt: DateTime

  @column.dateTime({
    autoCreate: true,
    autoUpdate: true,
    serialize: (value) => value?.toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY),
  })
  // @no-swagger
  declare updatedAt: DateTime

  @belongsTo(() => User)
  declare auther: BelongsTo<typeof User>

  @belongsTo(() => Supplier)
  declare supplier: BelongsTo<typeof Supplier>

  @hasMany(() => PurchaseItem)
  declare purchase_items: HasMany<typeof PurchaseItem>
}
