import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class extends BaseSchema {
  protected tableName = 'shipment_addresses';

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
      table.string('type').nullable();
      table.string('first_name').nullable();
      table.string('last_name').nullable();
      table.string('phone_number').nullable();
      table.string('address').nullable();
      table.string('city').nullable();
      table.string('state').nullable();
      table.string('country').nullable();

      table.unique(['user_id', 'type']);

      table.timestamp('created_at', { useTz: true }).defaultTo(this.now());
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now());
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
