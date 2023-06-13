import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class extends BaseSchema {
  protected tableName = 'variations';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table
        .integer('product_id')
        .unsigned()
        .notNullable()
        .references('products.id')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      table
        .integer('attribute_id')
        .unsigned()
        .notNullable()
        .unique()
        .references('attributes.id')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
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
