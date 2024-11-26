import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'purchase_items'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('purchase_id')
        .unsigned()
        .references('id')
        .inTable('purchases')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table
        .integer('product_id')
        .unsigned()
        .references('id')
        .inTable('products')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.integer('ordered_qty').nullable()
      table.integer('recevied_qty').nullable()
      table.decimal('cost').nullable()
      table.decimal('total_amount').defaultTo(0)
      table.text('notes').nullable()
      table.string('vendor_stock_code').nullable()
      table.string('status').defaultTo('draft')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
