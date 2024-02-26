import { DateTime } from 'luxon'
import { BaseModel, SnakeCaseNamingStrategy, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import OrderItem from '#models/order_item'
import ShipmentAddress from '#models/shipment_address'
import PaymentMethod from '#models/payment_method'

BaseModel.namingStrategy = new SnakeCaseNamingStrategy()

export default class Order extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare user_id: number | null

  @column()
  declare shipment_address_id: number | null

  @column()
  declare payment_method_id: number | null

  @column()
  declare status: string

  @column()
  declare order_key: string

  @column()
  declare total: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => ShipmentAddress)
  declare address: BelongsTo<typeof ShipmentAddress>

  @belongsTo(() => PaymentMethod)
  declare payment_method: BelongsTo<typeof PaymentMethod>

  @hasMany(() => OrderItem)
  declare order_items: HasMany<typeof OrderItem>
}
