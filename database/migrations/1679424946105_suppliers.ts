import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class extends BaseSchema {
  protected tableName = 'suppliers';

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
      table.string('supplier_name').notNullable().index();
      table.string('supplier_phone').nullable();
      table.string('supplier_email').nullable();
      table.string('status').notNullable().defaultTo('active');
      table.string('address').nullable();
      table.string('city').nullable();
      table.string('state').nullable();
      table.string('country').nullable();
      table.boolean('ordered').nullable().defaultTo(0);
      table.boolean('received').nullable().defaultTo(0);
      table.boolean('quantity_check').nullable().defaultTo(0);
      table.boolean('quality_check').nullable().defaultTo(0);
      table.boolean('put_away').nullable().defaultTo(0);
      table.string('to').nullable();
      table.string('cc').nullable();
      table.string('billing_type').nullable();
      table.string('billing_value').nullable();
      table.string('bill_cycles').nullable();
      table.string('bill_grace_period').nullable();

      table.unique(['shop_id', 'supplier_phone']);

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
