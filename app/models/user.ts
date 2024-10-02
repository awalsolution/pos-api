import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import {
  BaseModel,
  SnakeCaseNamingStrategy,
  beforeFind,
  column,
  manyToMany,
} from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import { ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import Permission from '#models/permission'
import Role from '#models/role'

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
  declare name: string | null

  @column()
  declare email: string

  @column()
  declare phone_number: string | null

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare status: boolean | number

  @column()
  declare remember_me: boolean | null

  @column()
  declare is_email_verified: boolean | number

  @column()
  declare email_verified_at: DateTime | string

  @column()
  declare is_phone_verified: boolean | number

  @column()
  declare phone_verified_at: DateTime | string

  @column()
  declare address: string | null

  @column()
  declare city: string | null

  @column()
  declare state: string | null

  @column()
  declare country: string | null

  @column()
  declare profile_picture: string | null

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
  declare updatedAt: DateTime | null

  static accessTokens = DbAccessTokensProvider.forModel(User)

  // hooks
  @beforeFind()
  static preloadListUserRoles(query: UserQuery) {
    query.preload('permissions').preload('roles', (rolesQuery: RoleQuery) => {
      rolesQuery.preload('permissions')
    })
  }

  // relation

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
