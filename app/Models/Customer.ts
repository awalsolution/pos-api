import { DateTime } from 'luxon'
import { withAuthFinder } from '@adonisjs/auth'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import { BaseModel, column, hasOne, SnakeCaseNamingStrategy } from '@adonisjs/lucid/orm'
import type { HasOne } from '@adonisjs/lucid/types/relations'
import CustomerProfile from '#models/customer_profile'

BaseModel.namingStrategy = new SnakeCaseNamingStrategy()
const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class Customer extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare shop_id: number | null

  @column()
  declare email: string

  @column()
  declare user_type: string

  @column()
  declare status: boolean

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare is_email_verified: boolean

  @column()
  declare email_verified_at: string

  @column()
  declare remember_token: boolean

  @column()
  declare is_phone_verified: boolean

  @column()
  declare phone_verified_at: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  static customer_token = DbAccessTokensProvider.forModel(Customer, {
    table: 'customer_auth_tokens',
    type: 'auth_token',
  })

  @hasOne(() => CustomerProfile)
  declare customer_profile: HasOne<typeof CustomerProfile>
}
