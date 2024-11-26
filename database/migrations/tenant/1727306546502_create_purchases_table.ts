import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'purchases'

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
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')

      table.string('invoice_no').nullable()
      table.decimal('gst').nullable()
      table.decimal('shipping_amount').defaultTo(0)
      table.decimal('total_items').defaultTo(0)
      table.decimal('total_qty').defaultTo(0)
      table.decimal('total_amount').defaultTo(0)
      table.text('notes').nullable()
      table.string('status').defaultTo('draft')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
