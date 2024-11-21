import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'supplier_metadata'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('supplier_id')
        .unsigned()
        .references('id')
        .inTable('suppliers')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.string('key_name').notNullable().index()
      table.string('key_value').notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
