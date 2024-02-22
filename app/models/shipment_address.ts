import { DateTime } from 'luxon'
import { BaseModel, SnakeCaseNamingStrategy, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'

BaseModel.namingStrategy = new SnakeCaseNamingStrategy()

export default class ShipmentAddress extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number | null

  @column()
  declare type: string | null

  @column()
  declare first_name: string | null

  @column()
  declare last_name: string | null

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

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}
