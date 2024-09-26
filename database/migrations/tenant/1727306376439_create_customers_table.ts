import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'customers'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').nullable()
      table.string('email').notNullable().unique()
      table.string('phone_number').nullable()
      table.boolean('status').notNullable().defaultTo(true)
      table.string('address').nullable()
      table.string('city').nullable()
      table.string('state').nullable()
      table.string('country').nullable()
      table.string('created_by').nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
