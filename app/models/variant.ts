import { DateTime } from 'luxon'
import {
  BaseModel,
  SnakeCaseNamingStrategy,
  belongsTo,
  column,
  hasMany,
  // manyToMany,
} from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import VariantImage from '#models/variant_image'
import Product from '#models/product'
// import Attribute from '#models/attribute'
// import AttributeValue from '#models/attribute_value'

BaseModel.namingStrategy = new SnakeCaseNamingStrategy()

export default class Variant extends BaseModel {
  @column({ isPrimary: true })
  // @no-swagger
  declare id: number

  @column()
  declare productId: number | null

  // @column()
  // declare attributeId: number | null
  // @column()
  // declare attributeValueId: number | null

  @column()
  declare sku: string | null

  @column({ columnName: 'option1' })
  declare option1: string | null

  @column({ columnName: 'option2' })
  declare option2: string | null

  @column({ columnName: 'option3' })
  declare option3: string | null

  @column()
  declare price: number | null

  @column()
  declare regular_price: number | null

  @column()
  declare sale_price: number | null

  @column()
  declare on_sale: Boolean

  @column()
  declare date_on_sale_from: DateTime | null

  @column()
  declare date_on_sale_to: DateTime | null

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

  @belongsTo(() => Product)
  declare product: BelongsTo<typeof Product>

  // @belongsTo(() => Attribute)
  // declare attribute: BelongsTo<typeof Attribute>

  // @manyToMany(() => AttributeValue, {
  //   pivotTable: 'variant_options',
  //   pivotTimestamps: true,
  //   localKey: 'id',
  //   pivotForeignKey: 'variant_id',
  //   relatedKey: 'id',
  //   pivotRelatedForeignKey: 'attribute_value_id',
  // })
  // declare options: ManyToMany<typeof AttributeValue>
}
