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
      table.string('name').notNullable()
      table.string('slug').nullable()
      table.string('type').notNullable().defaultTo('variable')
      table.string('status').notNullable().defaultTo('publish')
      table.boolean('featured_product').notNullable().defaultTo(false)
      table.boolean('related_product').notNullable().defaultTo(false)
      table.string('description').nullable()
      table.string('sku').notNullable()
      table.double('price').nullable()
      table.double('regular_price').nullable()
      table.double('sale_price').nullable()
      table.boolean('on_sale').notNullable().defaultTo(false)
      table.dateTime('date_on_sale_from').nullable()
      table.dateTime('date_on_sale_to').nullable()
      table.integer('total_sales').notNullable().defaultTo(0)
      table.integer('stock_quantity').nullable()
      table.string('stock_status').notNullable().defaultTo('instock')
      table.boolean('reviews_allowed').notNullable().defaultTo(false)
      table.string('average_rating').nullable()
      table.integer('rating_count').notNullable().defaultTo(0)
      table.string('thumbnail').nullable()

      table.unique(['shop_id', 'sku'])

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
