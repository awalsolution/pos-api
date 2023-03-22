import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "users";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id").primary();
      table.string("email").notNullable().unique().index();
      table.string("password").notNullable();
      table.boolean("is_account_activated").notNullable().defaultTo(1);
      table.boolean("remember_token").nullable();
      table.string("activation_code").nullable().index().unique();
      table.integer("forgot_password_code").nullable().unique();
      table.boolean("is_email_verified").notNullable().defaultTo(0);
      table.timestamp("email_verified_at").nullable();

      /**
       * Uses timestampz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp("created_at", { useTz: true }).defaultTo(this.now());
      table.timestamp("updated_at", { useTz: true }).defaultTo(this.now());
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
