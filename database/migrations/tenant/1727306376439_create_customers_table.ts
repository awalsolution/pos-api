import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'customers'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.uuid('guid').nullable()
      table.string('name').nullable()
      table.string('email').notNullable().unique()
      table.string('contact').nullable()
      table.string('phone').nullable()
      table.string('notes').nullable()
      table.string('max_credit').nullable()
      table.string('tex_category').nullable()
      table.boolean('status').notNullable().defaultTo(true)
      table.string('created_by').nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
