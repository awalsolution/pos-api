import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Permission from '#models/permission'

export default class Menu extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare menu_name: string

  @column()
  declare menu_type: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => Permission)
  declare permissions: HasMany<typeof Permission>
}
