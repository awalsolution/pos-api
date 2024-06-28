import { DateTime } from 'luxon'
import {BaseModel, SnakeCaseNamingStrategy, column, belongsTo} from '@adonisjs/lucid/orm'
import type {BelongsTo} from '@adonisjs/lucid/types/relations'
import Agencies from "#models/tenant/agencies";

BaseModel.namingStrategy = new SnakeCaseNamingStrategy()

export default class Bookings extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare agencyId: number

  @column()
  declare userId: number

  @column()
  public customerName: string | null;

  @column()
  declare status: string

  @column()
  public group_no: number | null;

  @column()
  public group_name: string | null;

  @column()
  public category: string | null;

  @column.dateTime({
    // autoCreate: true,
    serialize: (value) => value?.toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY),
  })
  public approvalDate: DateTimeMaybeValid;

  @column.dateTime({
    // autoCreate: true,
    serialize: (value) => value?.toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY),
  })
  public expectedDeparture: DateTime | null;

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

  @belongsTo(() => Agencies)
  public agency: BelongsTo<typeof Agencies>;
}
