import { DateTime } from 'luxon'
import { BaseModel, SnakeCaseNamingStrategy, column } from '@adonisjs/lucid/orm'

BaseModel.namingStrategy = new SnakeCaseNamingStrategy()

export default class Attribute extends BaseModel {
  @column({ isPrimary: true })
  // @no-swagger
  declare id: number

  @column()
  declare name: string

  @column()
  declare status: boolean

  @column.dateTime({ autoCreate: true })
  // @no-swagger
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  // @no-swagger
  declare updatedAt: DateTime
}
