import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class extends BaseSchema {
  protected tableName = 'attribute_terms';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table
        .integer('term_id')
        .unsigned()
        .notNullable()
        .references('terms.id')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      table
        .integer('attribute_id')
        .unsigned()
        .notNullable()
        .references('attributes.id')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now());
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now());
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
