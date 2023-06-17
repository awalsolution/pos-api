import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class extends BaseSchema {
  protected tableName = 'products';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table
        .integer('shop_id')
        .unsigned()
        .notNullable()
        .references('shops.id')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      table
        .integer('category_id')
        .unsigned()
        .notNullable()
        .references('categories.id')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      table.string('product_sku').notNullable().unique();
      table.string('title').notNullable().unique();
      table.string('slug').notNullable().unique();
      table.string('status').notNullable().defaultTo('active');
      table.string('description').nullable();
      // table.boolean('featured').notNullable().defaultTo(false);

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
