import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'products'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('product_category_id')
        .unsigned()
        .references('id')
        .inTable('products')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')

      table.string('name').notNullable().index()
      table.boolean('tax_able').notNullable().defaultTo(false)
      table.boolean('gst').notNullable().defaultTo(false)
      table.boolean('serialized').notNullable().defaultTo(false)
      table.boolean('status').notNullable().defaultTo(true).index()
      table.string('weight').nullable()
      table.text('description').nullable()
      table.decimal('base_price').nullable()
      table.decimal('list_price').nullable()
      table.decimal('discount').nullable()
      table.text('reminder').nullable()
      table.string('location').nullable().index()
      table.integer('min_qty').notNullable().defaultTo(1)
      table.integer('target_qty').notNullable().defaultTo(1)
      table.string('manufacture').nullable().index()
      table.string('url').nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
