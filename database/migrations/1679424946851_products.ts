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
      table.string('title').notNullable();
      table.string('slug').notNullable();
      table.string('type').notNullable();
      table.string('status').notNullable().defaultTo('publish');
      table.boolean('featured').notNullable().defaultTo(false);
      table.string('description').nullable();
      table.string('product_sku').notNullable().unique();
      table.double('price').nullable();
      table.double('regular_price').nullable();
      table.double('sale_price').nullable();
      table.dateTime('date_on_sale_from').nullable();
      table.dateTime('date_on_sale_to').nullable();
      table.boolean('on_sale').notNullable().defaultTo(false);
      table.integer('total_sales').nullable();
      table.string('stock_status').notNullable().defaultTo('instock');
      table.string('rating').nullable();
      table.string('categories').nullable();
      table.string('variations').nullable();
      table.string('default_attributes').nullable();
      table.string('product_images').nullable();

      table.unique(['shop_id', 'title']);
      table.unique(['shop_id', 'slug']);
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
