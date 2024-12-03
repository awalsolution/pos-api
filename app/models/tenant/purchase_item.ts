import { DateTime } from 'luxon'
import { BaseModel, SnakeCaseNamingStrategy, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Product from '#models/tenant/product'
import Purchase from '#models/tenant/purchase'

BaseModel.namingStrategy = new SnakeCaseNamingStrategy()

export default class PurchaseItem extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare productId: number

  @column()
  declare purchaseId: number

  @column()
  declare ordered_qty: number | null

  @column()
  declare recevied_qty: number | null

  @column()
  declare cost: number | null

  @column()
  declare total_amount: number | null

  @column()
  declare notes: string | null

  @column()
  declare vendor_stock_code: string | null

  @column()
  declare status: string | null

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
  @belongsTo(() => Product)
  declare products: BelongsTo<typeof Product>

  @belongsTo(() => Purchase)
  declare purchase: BelongsTo<typeof Purchase>
}
