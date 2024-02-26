import { DateTime } from 'luxon'
import { BaseModel, SnakeCaseNamingStrategy, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Shop from '#models/shop'

BaseModel.namingStrategy = new SnakeCaseNamingStrategy()

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare shopId: number | undefined

  @column()
  declare categoryId: number | undefined

  @column()
  declare product_code: string

  @column()
  declare title: string

  @column()
  declare slug: string

  @column()
  declare status: boolean

  @column()
  declare description: string | null

  @column()
  declare product_image: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Shop)
  declare shop: BelongsTo<typeof Shop>
}