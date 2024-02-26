import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'customers'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('email').notNullable().unique()
      table.string('password').notNullable()
      table.string('user_type').nullable()
      table.boolean('status').notNullable().defaultTo(true)
      table.boolean('remember_token').notNullable().defaultTo(false)
      table.boolean('is_email_verified').notNullable().defaultTo(false)
      table.datetime('email_verified_at').nullable()
      table.boolean('is_phone_verified').notNullable().defaultTo(false)
      table.datetime('phone_verified_at').nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
