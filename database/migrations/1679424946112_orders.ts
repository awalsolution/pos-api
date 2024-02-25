import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class extends BaseSchema {
  protected tableName = 'orders';

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      table
        .integer('shipment_address_id')
        .unsigned()
        .references('id')
        .inTable('shipment_addresses');
      table
        .integer('payment_method_id')
        .unsigned()
        .references('id')
        .inTable('payment_methods');
      table.string('order_key').nullable();
      table.string('total').nullable();
      table.string('status').notNullable().defaultTo('pending');

      table.timestamp('created_at', { useTz: true }).defaultTo(this.now());
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now());
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
