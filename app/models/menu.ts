import { DateTime } from 'luxon'
import { BaseModel, SnakeCaseNamingStrategy, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Permission from '#models/permission'

BaseModel.namingStrategy = new SnakeCaseNamingStrategy()

export default class Menu extends BaseModel {
  @column({ isPrimary: true })
  // @no-swagger
  declare id: number

  @column()
  declare menu_name: string

  @column()
  declare menu_type: string

  @column.dateTime({ autoCreate: true })
  // @no-swagger
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  // @no-swagger
  declare updatedAt: DateTime

  @hasMany(() => Permission)
  declare permissions: HasMany<typeof Permission>
}
