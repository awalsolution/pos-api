import { DateTime } from 'luxon'
import { withAuthFinder } from '@adonisjs/auth'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import { BaseModel, beforeSave, belongsTo, column, hasOne } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasOne } from '@adonisjs/lucid/types/relations'
import UserProfile from '#models/user_profile'
import Shop from '#models/shop'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare shopId: number | null

  @column()
  declare email: string

  @column()
  declare password: string

  @column()
  declare user_type: string | null

  @column()
  declare status: string

  @column()
  declare remember_token: boolean | null

  @column()
  declare is_email_verified: boolean

  @column()
  declare email_verified_at: DateTime

  @column()
  declare is_phone_verified: boolean

  @column()
  declare phone_verified_at: DateTime

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  static accessTokens = DbAccessTokensProvider.forModel(User)

  @beforeSave()
  static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await hash.make(user.password)
    }
  }

  // relations
  @hasOne(() => UserProfile)
  declare userProfile: HasOne<typeof UserProfile>

  @belongsTo(() => Shop)
  declare shop: BelongsTo<typeof Shop>
}
