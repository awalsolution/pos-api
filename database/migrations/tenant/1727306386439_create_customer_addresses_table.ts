import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'customer_addresses'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('customer_id')
        .unsigned()
        .references('id')
        .inTable('customers')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.string('street').nullable()
      table.string('city').nullable()
      table.string('state').nullable()
      table.string('zip').nullable()
      table.string('country').nullable()
      table.boolean('is_default').nullable()
      table.string('type').notNullable().defaultTo('address')
      table.boolean('status').notNullable().defaultTo(true)

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
