import { DateTime } from 'luxon'
import { BaseModel, SnakeCaseNamingStrategy, column, hasMany, belongsTo } from '@adonisjs/lucid/orm'
import type { HasMany, BelongsTo } from '@adonisjs/lucid/types/relations'
import SupplierAddress from '#models/tenant/supplier_address'
import SupplierMetadata from '#models/tenant/supplier_metadata'
import Purchase from '#models/tenant/purchase'
import User from '#models/user'

BaseModel.namingStrategy = new SnakeCaseNamingStrategy()

export default class Supplier extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare name: string

  @column()
  declare contact: string

  @column()
  declare phone: string

  @column()
  declare email: string

  @column()
  declare minOrder: number

  @column()
  declare pdFrightAmount: number

  @column()
  declare shipVia: string

  @column()
  declare defaulPoDays: number

  @column()
  declare status: boolean

  @column.dateTime({
    autoCreate: true,
    serialize: (value) => value?.toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY),
  })
  declare createdAt: DateTime

  @column.dateTime({
    autoCreate: true,
    autoUpdate: true,
    serialize: (value) => value?.toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY),
  })
  declare updatedAt: DateTime

  @belongsTo(() => User)
  declare auther: BelongsTo<typeof User>

  @hasMany(() => SupplierAddress)
  declare address: HasMany<typeof SupplierAddress>

  @hasMany(() => SupplierMetadata)
  declare metadata: HasMany<typeof SupplierMetadata>

  @hasMany(() => Purchase)
  declare purchases: HasMany<typeof Purchase>
}
