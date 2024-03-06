import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'product_attributes'

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

      table.string('name')
      table.string('option')

      table.unique(['product_id', 'name', 'option'])

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
