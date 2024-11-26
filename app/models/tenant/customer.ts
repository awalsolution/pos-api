import { DateTime } from 'luxon'
import {
  BaseModel,
  SnakeCaseNamingStrategy,
  beforeCreate,
  column,
  hasMany,
  belongsTo,
} from '@adonisjs/lucid/orm'
import type { HasMany, BelongsTo } from '@adonisjs/lucid/types/relations'
import { v4 as uuidv4 } from 'uuid'
import CustomerAddress from '#models/tenant/customer_address'
import CustomerMetadata from '#models/tenant/customer_metadata'
import User from '#models/user'

BaseModel.namingStrategy = new SnakeCaseNamingStrategy()

export default class Customer extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare guid: string

  @column()
  declare name: string

  @column()
  declare email: string

  @column()
  declare contact: string

  @column()
  declare phone: string

  @column()
  declare notes: string

  @column()
  declare max_credit: string

  @column()
  declare tex_category: string

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

  @hasMany(() => CustomerAddress)
  declare address: HasMany<typeof CustomerAddress>

  @hasMany(() => CustomerMetadata)
  declare metadata: HasMany<typeof CustomerMetadata>

  // hooks
  @beforeCreate()
  static assignUuid(customer: Customer) {
    customer.guid = uuidv4()
  }
}
