import { DateTime } from 'luxon'
import { BaseModel, SnakeCaseNamingStrategy, column } from '@adonisjs/lucid/orm'

BaseModel.namingStrategy = new SnakeCaseNamingStrategy()

export default class VendorAddress extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare vendorId: number | null

  @column()
  declare street: string | null

  @column()
  declare city: string | null

  @column()
  declare state: string | null

  @column()
  declare zip: string | null

  @column()
  declare country: string | null

  @column()
  declare isDefault: boolean | null

  @column()
  declare type: string | null

  @column()
  declare status: boolean | null

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
}
