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
      table.string('supplier_address').nullable();
      table.string('supplier_city').nullable();
      table.string('supplier_state').nullable();
      table.string('supplier_country').nullable();
      table.string('ordered').nullable();
      table.string('received').nullable();
      table.string('quantity_check').nullable();
      table.string('quality_check').nullable();
      table.string('put_away').nullable();
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
