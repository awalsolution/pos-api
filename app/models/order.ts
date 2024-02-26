import { DateTime } from 'luxon'
import { BaseModel, SnakeCaseNamingStrategy, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Customer from '#models/customer'
import OrderItem from '#models/order_item'
import ShipmentAddress from '#models/shipment_address'
import PaymentMethod from '#models/payment_method'

BaseModel.namingStrategy = new SnakeCaseNamingStrategy()

export default class Order extends BaseModel {
  @column({ isPrimary: true })
  // @no-swagger
  declare id: number

  @column()
  declare customerId: number | null

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
  // @no-swagger
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  // @no-swagger
  declare updatedAt: DateTime

  @belongsTo(() => Customer)
  declare customer: BelongsTo<typeof Customer>

  @belongsTo(() => ShipmentAddress)
  declare address: BelongsTo<typeof ShipmentAddress>

  @belongsTo(() => PaymentMethod)
  declare payment_method: BelongsTo<typeof PaymentMethod>

  @hasMany(() => OrderItem)
  declare order_items: HasMany<typeof OrderItem>
}
