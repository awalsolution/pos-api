import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import {
  BaseModel,
  SnakeCaseNamingStrategy,
  beforeFind,
  column,
  hasOne,
  manyToMany,
} from '@adonisjs/lucid/orm'
import type { HasOne, ManyToMany } from '@adonisjs/lucid/types/relations'
import { ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import Permission from '#models/permission'
import Role from '#models/role'
import Profile from '#models/profile'

BaseModel.namingStrategy = new SnakeCaseNamingStrategy()

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
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare status: boolean

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
  declare updatedAt: DateTime | null

  static accessTokens = DbAccessTokensProvider.forModel(User)

  // hooks
  @beforeFind()
  static preloadListUserRoles(query: UserQuery) {
    query
      .preload('permissions')
      .preload('roles', (rolesQuery: RoleQuery) => {
        rolesQuery.preload('permissions')
      })
      .preload('profile')
  }

  // relation
  @hasOne(() => Profile)
  declare profile: HasOne<typeof Profile>

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
