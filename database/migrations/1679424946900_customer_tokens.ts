import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class extends BaseSchema {
  protected tableName = 'customer_tokens';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary();
      table
        .integer('customer_id')
        .unsigned()
        .references('id')
        .inTable('customers')
        .onDelete('CASCADE');
      table.string('name').notNullable();
      table.string('type').notNullable();
      table.string('token').notNullable().unique();

      /**
       * Uses timestampz for PostgreSQL and DATETIME2 for MSSQL
       */
      table
        .timestamp('expires_at', { useTz: true })
        .nullable()
        .defaultTo(this.now());
      table
        .timestamp('created_at', { useTz: true })
        .notNullable()
        .defaultTo(this.now());
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
