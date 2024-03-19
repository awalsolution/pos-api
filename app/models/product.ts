import { DateTime } from 'luxon'
import {
  BaseModel,
  SnakeCaseNamingStrategy,
  belongsTo,
  column,
  hasMany,
  manyToMany,
} from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import Shop from '#models/shop'
import ProductImage from '#models/product_image'
import Category from '#models/category'
import Attribute from '#models/attribute'
import Variant from '#models/variant'
import Tag from '#models/tag'

BaseModel.namingStrategy = new SnakeCaseNamingStrategy()

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  // @no-swagger
  declare id: number

  @column()
  declare shopId: number | null

  @column()
  declare categoryId: number | null

  @column()
  declare name: string

  @column()
  declare slug: string | null

  // @column()
  // declare type: string

  @column()
  declare status: string

  @column()
  declare featured_product: boolean

  @column()
  declare related_product: boolean

  @column()
  declare description: string | null

  // @column()
  // declare sku: string

  // @column()
  // declare price: number

  // @column()
  // declare regular_price: number | null

  // @column()
  // declare sale_price: number | null

  // @column()
  // declare on_sale: Boolean

  // @column()
  // declare date_on_sale_from: DateTime | null

  // @column()
  // declare date_on_sale_to: DateTime | null

  // @column()
  // declare total_sales: number

  // @column()
  // declare stock_quantity: number | null

  // @column()
  // declare stock_status: string

  @column()
  declare reviews_allowed: boolean

  @column()
  declare average_rating: string | null

  @column()
  declare rating_count: string | null

  @column()
  declare thumbnail: string | null

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

  @belongsTo(() => Shop)
  declare shop: BelongsTo<typeof Shop>

  @belongsTo(() => Category)
  declare category: BelongsTo<typeof Category>

  @hasMany(() => Attribute)
  declare attributes: HasMany<typeof Attribute>

  @hasMany(() => Variant)
  declare variants: HasMany<typeof Variant>

  @manyToMany(() => Tag, {
    pivotTable: 'product_tags',
    pivotTimestamps: true,
    localKey: 'id',
    pivotForeignKey: 'product_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'tag_id',
  })
  declare tags: ManyToMany<typeof Tag>

  @hasMany(() => ProductImage)
  declare gallery: HasMany<typeof ProductImage>
}
