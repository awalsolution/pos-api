import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class extends BaseSchema {
  protected tableName = 'payment_methods';

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table.string('method_title').notNullable().unique();
      table.boolean('status').notNullable().defaultTo(true);

      table.timestamp('created_at', { useTz: true }).defaultTo(this.now());
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now());
    });
  }

  async down() {
    this.schema.dropTable(this.tableName);
  }
}
