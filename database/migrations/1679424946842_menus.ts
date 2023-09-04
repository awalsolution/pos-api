import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class extends BaseSchema {
  protected tableName = 'menus';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary();
      table.integer('parent_id').nullable();
      table.string('route_name').notNullable().unique();
      table.string('menu_url').notNullable().unique();
      table.string('menu_name').notNullable().unique();
      table.integer('menu_order').notNullable();
      table.string('menu_icon').nullable();
      table.boolean('is_parent').nullable();
      table.string('status').notNullable().defaultTo('active');

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
