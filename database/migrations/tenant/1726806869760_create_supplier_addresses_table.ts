import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'supplier_addresses'

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
      table.string('street').nullable()
      table.string('city').nullable()
      table.string('state').nullable()
      table.string('zip').nullable()
      table.string('country').nullable()
      table.boolean('is_default').nullable()
      table.string('type').notNullable().defaultTo('shipping')
      table.boolean('status').notNullable().defaultTo(true)

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
