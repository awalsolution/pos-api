import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'vendor_addresses'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('vendor_id').unsigned().references('id').inTable('vendors').onDelete('CASCADE')
      table.string('street').nullable()
      table.string('city').nullable()
      table.string('state').nullable()
      table.string('zip').nullable()
      table.string('country').nullable()
      table.boolean('is_default').nullable()
      table.string('type').defaultTo('shipping')
      table.boolean('status').defaultTo('1')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
