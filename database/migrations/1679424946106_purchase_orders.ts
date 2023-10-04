import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class extends BaseSchema {
  protected tableName = 'purchase_orders';

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
      table
        .integer('warehouse_id')
        .unsigned()
        .notNullable()
        .references('warehouses.id')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      table
        .integer('merchant_id')
        .unsigned()
        .notNullable()
        .references('merchants.id')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      table
        .integer('supplier_id')
        .unsigned()
        .notNullable()
        .references('suppliers.id')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      table.timestamp('date').notNullable();
      table.string('ref_no').nullable();
      table.string('status').notNullable().defaultTo('active');
      table.integer('quantity').notNullable().defaultTo(0);
      table.integer('received_quantity').notNullable().defaultTo(0);
      table.double('total').notNullable();
      table.double('paid').nullable();
      table.double('balance').nullable();
      table.string('payment_status').notNullable().defaultTo('pending');
      table.string('insert_stock').notNullable().defaultTo('incomplete');
      table.string('created_by').nullable();
      table.text('note').nullable();
      table.string('included_grand_total').nullable();
      table.double('grand_total').nullable();
      table.timestamp('expected_date').nullable();
      table.string('order_type').notNullable();
      table.timestamp('putaway_time').nullable();
      table.timestamp('received_time').nullable();
      table.timestamp('ordered_time').nullable();
      table.timestamp('quantity_checked_time').nullable();
      table.timestamp('quality_checked_time').nullable();
      table.double('po_paid').notNullable().defaultTo(0);
      table.double('po_balance').notNullable().defaultTo(0);
      table.integer('wholesale').notNullable().defaultTo(0);
      table.bigInteger('unwanted_created_from').nullable();
      table.timestamp('budget_approval_time').nullable();
      table.timestamp('business_approval_time').nullable();
      table.string('masking_name').nullable();
      table.string('type').nullable();
      table.string('consignment_type').nullable();
      table.string('liability').nullable();
      table.string('billing_type').nullable();
      table.double('billing_value').nullable();
      table.double('credit_day').nullable();

      table.unique(['shop_id', 'merchant_name']);

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
