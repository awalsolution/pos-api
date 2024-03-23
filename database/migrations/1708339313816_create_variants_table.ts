import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'variants'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      // table
      //   .integer('shop_id')
      //   .unsigned()
      //   .references('id')
      //   .inTable('shops')
      //   .onUpdate('CASCADE')
      //   .onDelete('CASCADE')
      table
        .integer('product_id')
        .unsigned()
        .references('id')
        .inTable('products')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      // table
      //   .integer('attribute_id')
      //   .unsigned()
      //   .references('id')
      //   .inTable('attributes')
      //   .onUpdate('CASCADE')
      //   .onDelete('CASCADE')
      // table
      //   .integer('attribute_value_id')
      //   .unsigned()
      //   .references('id')
      //   .inTable('attribute_values')
      //   .onUpdate('CASCADE')
      //   .onDelete('CASCADE')

      table.string('sku').nullable()
      table.string('option1').nullable()
      table.string('option2').nullable()
      table.string('option3').nullable()
      table.double('price').nullable()
      table.double('regular_price').nullable()
      table.double('sale_price').nullable()
      table.boolean('on_sale').notNullable().defaultTo(false)
      table.dateTime('date_on_sale_from').nullable()
      table.dateTime('date_on_sale_to').nullable()
      table.string('status').notNullable().defaultTo('publish')
      table.integer('stock_quantity').nullable()
      table.string('stock_status').notNullable().defaultTo('instock')
      table
        .string('thumbnail')
        .nullable()
        .defaultTo('/uploads/products/xvlm4hapj08awmh6j8c4al7p.jpg')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
