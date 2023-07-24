import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class extends BaseSchema {
  protected tableName = 'billing_addresses';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary();
      table
        .integer('customer_id')
        .unsigned()
        .nullable()
        .references('customers.id')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      table.string('address_type').notNullable().defaultTo('billing');
      table.string('phone_number').nullable();
      table.string('first_name').nullable();
      table.string('last_name').nullable();
      table.string('street').nullable();
      table.string('city').nullable();
      table.string('state').nullable();
      table.string('country').nullable();

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
