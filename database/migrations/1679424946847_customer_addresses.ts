import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class extends BaseSchema {
  protected tableName = 'customer_addresses';

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
      table.string('address_type').nullable();
      table.string('phone_number').nullable();
      table.string('first_name').nullable();
      table.string('last_name').nullable();
      table.string('address_1').nullable();
      table.string('address_2').nullable();
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
