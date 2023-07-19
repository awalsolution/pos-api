import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class extends BaseSchema {
  protected tableName = 'products';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table
        .integer('shop_id')
        .unsigned()
        .notNullable()
        .references('shops.id')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      table
        .integer('category_id')
        .unsigned()
        .notNullable()
        .references('categories.id')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      table.string('product_sku').notNullable().unique();
      table.string('title').notNullable();
      table.string('slug').notNullable();
      table.string('status').notNullable().defaultTo('active');
      table.string('description').nullable();
      table.double('price').notNullable();
      table.double('regular_price').nullable();
      table.double('sale_price').nullable();
      table.dateTime('date_on_sale_from').nullable();
      table.dateTime('date_on_sale_to').nullable();
      table.boolean('on_sale').notNullable().defaultTo(false);
      table.integer('total_sales').nullable();
      table.integer('stock_quantity').nullable();
      table.string('stock_status').notNullable().defaultTo('instock');
      table.string('rating').nullable();
      table.string('product_images').nullable();
      // table.boolean('featured').notNullable().defaultTo(false);

      table.unique(['shop_id', 'title', 'slug']);
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now());
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now());
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
