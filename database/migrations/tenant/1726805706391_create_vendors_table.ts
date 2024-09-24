import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'vendors'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable().index()
      table.string('contact').nullable()
      table.string('phone').nullable()
      table.string('email').nullable()
      table.decimal('min_order').defaultTo(0)
      table.decimal('pd_fright_amount').defaultTo(0)
      table.string('ship_via').nullable()
      table.integer('defaul_po_days').defaultTo(7)
      table.boolean('status').defaultTo(1).index()
      table.string('created_by').nullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
