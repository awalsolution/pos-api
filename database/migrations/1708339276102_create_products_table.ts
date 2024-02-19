import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'products'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('shop_id')
        .unsigned()
        .references('id')
        .inTable('shops')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table
        .integer('category_id')
        .unsigned()
        .references('id')
        .inTable('categories')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.string('product_code').notNullable().unique()
      table.string('title').notNullable()
      table.string('slug').notNullable()
      table.boolean('status').notNullable().defaultTo(true)
      table.string('description').nullable()
      table.string('product_image').nullable()

      table.unique(['shop_id', 'title', 'slug'])

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
