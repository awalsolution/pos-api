import { DateTime } from 'luxon'
import { BaseModel, SnakeCaseNamingStrategy, column, hasMany } from '@adonisjs/lucid/orm'
import VendorAddress from './vendor_address.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import VendorMetadata from './vendor_metadata.js'

BaseModel.namingStrategy = new SnakeCaseNamingStrategy()

export default class Vendor extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

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

  @column()
  declare created_by: string | null

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

  @hasMany(() => VendorAddress)
  declare address: HasMany<typeof VendorAddress>

  @hasMany(() => VendorMetadata)
  declare metadata: HasMany<typeof VendorMetadata>
}
