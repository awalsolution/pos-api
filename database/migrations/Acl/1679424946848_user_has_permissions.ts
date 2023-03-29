import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "user_has_permissions";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id");
      table
        .integer("user_id")
        .unsigned()
        .references("users.id")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      table
        .integer("permission_id")
        .unsigned()
        .references("permissions.id")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");

      table.unique(["user_id", "permission_id"]);
    });
  }

  public async down() {
    this.schema
      .alterTable(this.tableName, (table) => {
        table.dropForeign("user_id");
        table.dropForeign("permission_id");
      })
      .dropTable(this.tableName);
  }
}
