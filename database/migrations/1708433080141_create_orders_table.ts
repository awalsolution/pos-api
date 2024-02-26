import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'orders'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('shop_id').nullable()
      table
        .integer('customer_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.integer('shipment_address_id').unsigned().references('id').inTable('shipment_addresses')
      table.integer('payment_method_id').unsigned().references('id').inTable('payment_methods')
      table.string('order_key').nullable()
      table.string('total').nullable()
      table.string('status').notNullable().defaultTo('pending')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
