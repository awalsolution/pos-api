import { DateTime } from 'luxon'
import {
  BaseModel,
  SnakeCaseNamingStrategy,
  belongsTo,
  column,
  manyToMany,
} from '@adonisjs/lucid/orm'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import Attribute from '#models/attribute'
import Variant from '#models/variant'

BaseModel.namingStrategy = new SnakeCaseNamingStrategy()

export default class AttributeValue extends BaseModel {
  @column({ isPrimary: true })
  // @no-swagger
  declare id: number

  @column()
  declare attributeId: number | null

  @column()
  declare value: string

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

  @belongsTo(() => Attribute)
  declare attribute: BelongsTo<typeof Attribute>

  @manyToMany(() => Variant, {
    pivotTable: 'variant_options',
    pivotTimestamps: true,
    localKey: 'id',
    pivotForeignKey: 'attribute_value_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'variant_id',
  })
  declare variants: ManyToMany<typeof Variant>
}
