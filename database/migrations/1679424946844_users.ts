import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class extends BaseSchema {
  protected tableName = 'users';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary();
      table
        .integer('shop_id')
        .unsigned()
        .nullable()
        .references('shops.id')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      table.string('email').notNullable().unique().index();
      table.string('password').notNullable();
      table.string('user_type').nullable();
      table.boolean('is_active').notNullable().defaultTo(true);
      table.boolean('remember_token').notNullable().defaultTo(false);
      table.boolean('is_email_verified').notNullable().defaultTo(false);
      table.timestamp('email_verified_time').nullable();
      table.boolean('is_phone_verified').notNullable().defaultTo(false);
      table.timestamp('phone_verified_time').nullable();

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
