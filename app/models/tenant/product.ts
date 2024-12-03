import { DateTime } from 'luxon'
import { BaseModel, SnakeCaseNamingStrategy, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import ProductCategory from '#models/tenant/product_category'
import ProductCode from '#models/tenant/product_code'
import ProductImage from '#models/tenant/product_image'
import User from '#models/user'

BaseModel.namingStrategy = new SnakeCaseNamingStrategy()

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare productCategoryId: number

  @column()
  declare userId: number

  @column()
  declare name: string

  @column()
  declare tax_able: boolean

  @column()
  declare gst: boolean

  @column()
  declare status: boolean

  @column()
  declare serialized: boolean

  @column()
  declare weight: string | null

  @column()
  declare description: string | null

  @column()
  declare base_price: number | null

  @column()
  declare list_price: number | null

  @column()
  declare discount: number | null

  @column()
  declare reminder: string | null

  @column()
  declare location: string | null

  @column()
  declare min_qty: number | null

  @column()
  declare target_qty: number | null

  @column()
  declare manufacture: string | null

  @column()
  declare thumbnail: string | null

  @column.dateTime({
    autoCreate: true,
    serialize: (value) => value?.toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY),
  })
  // @no-swaggerpar
  declare createdAt: DateTime

  @column.dateTime({
    autoCreate: true,
    autoUpdate: true,
    serialize: (value) => value?.toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY),
  })
  // @no-swagger
  declare updatedAt: DateTime

  // relation
  @belongsTo(() => ProductCategory)
  declare category: BelongsTo<typeof ProductCategory>

  @belongsTo(() => User)
  declare auther: BelongsTo<typeof User>

  @hasMany(() => ProductCode)
  declare product_codes: HasMany<typeof ProductCode>

  @hasMany(() => ProductImage)
  declare product_images: HasMany<typeof ProductImage>
}
