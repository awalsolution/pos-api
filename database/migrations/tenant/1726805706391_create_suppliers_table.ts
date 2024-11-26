import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'suppliers'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.string('name').notNullable().index()
      table.string('contact').nullable()
      table.string('phone').nullable()
      table.string('email').nullable()
      table.decimal('min_order').defaultTo(0)
      table.decimal('pd_fright_amount').defaultTo(0)
      table.string('ship_via').nullable()
      table.integer('defaul_po_days').defaultTo(7)
      table.boolean('status').notNullable().defaultTo(true).index()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
