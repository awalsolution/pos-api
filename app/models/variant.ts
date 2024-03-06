import { DateTime } from 'luxon'
import { BaseModel, SnakeCaseNamingStrategy, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import VariantImage from '#models/variant_image'
// import Attribute from './attribute.js'

BaseModel.namingStrategy = new SnakeCaseNamingStrategy()

export default class Variant extends BaseModel {
  @column({ isPrimary: true })
  // @no-swagger
  declare id: number

  @column()
  declare productId: number | null

  @column()
  declare sku: string | null

  @column()
  declare color: string | null

  @column()
  declare size: string | null

  @column()
  declare price: number | null

  @column()
  declare regular_price: number | null

  @column()
  declare sale_price: number | null

  @column()
  declare date_on_sale_from: DateTime | null

  @column()
  declare date_on_sale_to: DateTime | null

  @column()
  declare on_sale: Boolean

  @column()
  declare status: string

  @column()
  declare stock_quantity: number | null

  @column()
  declare stock_status: string

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

  @hasMany(() => VariantImage)
  declare gallery: HasMany<typeof VariantImage>

  // @manyToMany(() => Attribute, {
  //   pivotTable: 'variant_attributes',
  //   pivotTimestamps: true,
  //   localKey: 'id',
  //   pivotForeignKey: 'variant_id ',
  //   relatedKey: 'id',
  //   pivotRelatedForeignKey: 'attribute_id',
  // })
  // declare attributes: ManyToMany<typeof Attribute>
}
