import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'order_items'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('order_id')
        .unsigned()
        .references('id')
        .inTable('orders')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.string('product_id').nullable()
      table.string('variant_id').nullable()
      table.string('product_sku').nullable()
      table.string('product_title').nullable()
      table.string('quantity').nullable()
      table.string('product_price').nullable()
      table.string('subtotal').nullable()
      table.string('product_image').nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
