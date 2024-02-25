import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class extends BaseSchema {
  protected tableName = 'customers';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary();
      table.integer('shop_id').nullable();
      table.string('email').notNullable().index();
      table.string('password').notNullable();
      table.string('user_type').nullable();
      table.boolean('status').notNullable().defaultTo(true);
      table.boolean('remember_token').notNullable().defaultTo(false);
      table.boolean('is_email_verified').notNullable().defaultTo(false);
      table.timestamp('email_verified_time').nullable();
      table.boolean('is_phone_verified').notNullable().defaultTo(false);
      table.timestamp('phone_verified_time').nullable();

      table.unique(['shop_id', 'email']);

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
