import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class extends BaseSchema {
  protected tableName = 'customers';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary();
      table
        .integer('shop_id')
        .unsigned()
        .references('shops.id')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      table.string('email').notNullable().unique().index();
      table.string('phone').notNullable();
      table.boolean('status').defaultTo(false).index();
      table.string('first_name').notNullable();
      table.string('last_name').nullable();
      table.string('password').notNullable();
      table.string('user_type').notNullable().defaultTo('customer');
      table.boolean('remember_token').notNullable().defaultTo(false);
      table.boolean('is_email_verified').notNullable().defaultTo(false);
      table.timestamp('email_verified_time').nullable();
      table.boolean('is_phone_verified').notNullable().defaultTo(false);
      table.timestamp('phone_verified_time').nullable();
      table.string('profile_picture').nullable();
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
