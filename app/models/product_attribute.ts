import { DateTime } from 'luxon'
import { BaseModel, SnakeCaseNamingStrategy, belongsTo, column } from '@adonisjs/lucid/orm'
import Attribute from './attribute.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

BaseModel.namingStrategy = new SnakeCaseNamingStrategy()

export default class ProductAttribute extends BaseModel {
  @column({ isPrimary: true })
  // @no-swagger
  declare id: number

  @column()
  declare productId: number | null

  @column()
  declare attributeId: number | null

  @column()
  declare option: string | null

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
}
