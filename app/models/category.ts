import { DateTime } from 'luxon'
import { BaseModel, SnakeCaseNamingStrategy, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Shop from '#models/shop'
import Product from '#models/product'

BaseModel.namingStrategy = new SnakeCaseNamingStrategy()

export default class Category extends BaseModel {
  @column({ isPrimary: true })
  // @no-swagger
  declare id: number

  @column()
  declare shopId: number | undefined

  @column()
  declare name: string

  @column()
  declare parent_id: number | null

  @column()
  declare image: string

  @column()
  declare status: boolean

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

  @hasMany(() => Product)
  declare products: HasMany<typeof Product>

  @hasMany(() => Category, { foreignKey: 'parent_id' })
  declare sub_category: HasMany<typeof Category>

  @belongsTo(() => Shop)
  declare shop: BelongsTo<typeof Shop>
}
