import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class extends BaseSchema {
  protected tableName = 'purchase_products';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary();
      table
        .integer('purchase_order_id')
        .unsigned()
        .notNullable()
        .references('purchase_orders.id')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      table
        .integer('product_id')
        .unsigned()
        .notNullable()
        .references('products.id')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      table.string('sku_id').notNullable();
      table.double('net_unit_cost').notNullable();
      table.integer('quantity').notNullable();
      table.integer('received_quantity').notNullable().defaultTo(0);
      table.double('adjusted_subtotal').notNullable().defaultTo(0);
      table.integer('original_quantity').notNullable().defaultTo(0);
      table.integer('missing').notNullable().defaultTo(0);
      table.integer('damaged').notNullable().defaultTo(0);
      table.integer('photography').notNullable().defaultTo(0);
      table.double('subtotal').notNullable().defaultTo(0);
      table.string('status').notNullable().defaultTo('Not Added');
      table.integer('pre_order').notNullable().defaultTo(0);
      table.integer('last_qty').notNullable().defaultTo(0);
      table.integer('initial_qty').notNullable().defaultTo(0);
      table.string('product_title').nullable();
      table.integer('unwanted').notNullable().defaultTo(0);
      table.integer('putaway_quantity').notNullable().defaultTo(0);
      table.double('manufacturing_cost').nullable();

      table.unique(['shop_id', 'merchant_name']);

      /**
       * Uses timestampz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now());
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now());
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
