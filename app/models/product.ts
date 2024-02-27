import { DateTime } from 'luxon'
import { BaseModel, SnakeCaseNamingStrategy, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Shop from '#models/shop'
import Variant from '#models/variant'
import Category from '#models/category'

BaseModel.namingStrategy = new SnakeCaseNamingStrategy()

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  // @no-swagger
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
  declare thumbnail: string | null

  @column.dateTime({ autoCreate: true })
  // @no-swagger
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  // @no-swagger
  declare updatedAt: DateTime

  @belongsTo(() => Shop)
  declare shop: BelongsTo<typeof Shop>

  @belongsTo(() => Category)
  declare category: BelongsTo<typeof Category>

  @hasMany(() => Variant)
  declare variants: HasMany<typeof Variant>
}
