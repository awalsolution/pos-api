import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "uploads";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id");
      table
        .integer("user_id")
        .unsigned()
        .unique()
        .references("id")
        .inTable("users")
        .onDelete("CASCADE");
      table.string("name").nullable();
      table.string("url").nullable();
      table.string("previewUrl").nullable();
      table.string("extension").nullable();
      table.string("caption").nullable();
      table.string("hash").nullable();
      table.json("formats").nullable();
      table.timestamp("deleted_at").nullable();
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp("created_at", { useTz: true }).defaultTo(this.now());
      table.timestamp("updated_at", { useTz: true }).defaultTo(this.now());
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
