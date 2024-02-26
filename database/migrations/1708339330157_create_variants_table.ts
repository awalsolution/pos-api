import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'variants'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('product_id')
        .unsigned()
        .references('id')
        .inTable('products')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table
        .integer('attribute_id')
        .unsigned()
        .references('id')
        .inTable('attributes')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.string('sku_id').notNullable().unique()
      table.string('attribute_value').nullable()
      table.double('price').nullable()
      table.double('regular_price').nullable()
      table.boolean('status').notNullable().defaultTo(true)
      table.double('sale_price').nullable()
      table.dateTime('date_on_sale_from').nullable()
      table.dateTime('date_on_sale_to').nullable()
      table.boolean('on_sale').notNullable().defaultTo(false)
      table.integer('stock_quantity').nullable()
      table.string('stock_status').notNullable().defaultTo('instock')
      table.integer('rating').nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
