import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class extends BaseSchema {
  protected tableName = 'variations';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table.string('product_sku').notNullable().unique();
      table.string('title').notNullable();
      table.string('slug').notNullable();
      table.double('price').nullable().defaultTo(10);
      table.double('sale_price').nullable().defaultTo(9);
      table.boolean('is_active').defaultTo(true);
      table.string('description').nullable();
      table.string('product_images').nullable();

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
