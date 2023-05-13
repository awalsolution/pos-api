import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class extends BaseSchema {
  protected tableName = 'products';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table.integer('shop_id').unsigned().nullable().references('shops.id');
      table.string('product_sku').nullable().unique();
      table.string('title').notNullable();
      table.string('slug').notNullable();
      table.double('price').nullable().defaultTo(10);
      table.double('sale_price').nullable().defaultTo(9);
      table.boolean('is_active').nullable().defaultTo(1);
      table.string('description').nullable();
      table.string('short_description').nullable();
      table.string('product_images').nullable();

      table.unique(['shop_id', 'title']);
      table.unique(['shop_id', 'slug']);
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
