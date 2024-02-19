import { DateTime } from 'luxon'
import { withAuthFinder } from '@adonisjs/auth'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import {
  BaseModel,
  // afterFetch,
  beforeFind,
  // beforeSave,
  belongsTo,
  column,
  hasOne,
  manyToMany,
} from '@adonisjs/lucid/orm'
import type { BelongsTo, HasOne, ManyToMany } from '@adonisjs/lucid/types/relations'
import type { ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'
import UserProfile from '#models/user_profile'
import Permission from '#models/permission'
import Shop from '#models/shop'
import Role from '#models/role'

type UserQuery = ModelQueryBuilderContract<typeof User>
type RoleQuery = ModelQueryBuilderContract<typeof Role>

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

  // @beforeSave()
  // static async hashPassword(user: User) {
  //   if (user.$dirty.password) {
  //     user.password = await hash.make(user.password)
  //   }
  // }

  // @afterFetch()
  // static deletePasswordList(users: User[]) {
  //   users.forEach((user) => {
  //     delete user.$attributes.password
  //   })
  // }

  @beforeFind()
  static preloadListUserRoles(query: UserQuery) {
    query
      .preload('permissions')
      .preload('roles', (rolesQuery: RoleQuery) => {
        rolesQuery.preload('permissions')
      })
      .preload('userProfile')
      .preload('shop')
  }

  // relations
  @hasOne(() => UserProfile)
  declare userProfile: HasOne<typeof UserProfile>

  @belongsTo(() => Shop)
  declare shop: BelongsTo<typeof Shop>

  @manyToMany(() => Role, {
    pivotTable: 'user_has_roles',
    localKey: 'id',
    pivotForeignKey: 'user_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'role_id',
  })
  declare roles: ManyToMany<typeof Role>

  @manyToMany(() => Permission, {
    pivotTable: 'user_has_permissions',
    localKey: 'id',
    pivotForeignKey: 'user_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'permission_id',
  })
  declare permissions: ManyToMany<typeof Permission>
}
