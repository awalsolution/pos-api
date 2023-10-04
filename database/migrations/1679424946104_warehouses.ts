import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class extends BaseSchema {
  protected tableName = 'warehouses';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary();
      table
        .integer('shop_id')
        .unsigned()
        .notNullable()
        .references('shops.id')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      table.string('warehouse_name').notNullable().index();
      table.string('warehouse_phone').notNullable();
      table.string('status').notNullable().defaultTo('active');
      table.string('address').nullable();
      table.string('city').nullable();
      table.string('state').nullable();
      table.string('country').nullable();

      table.unique(['shop_id', 'warehouse_name']);

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
