import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "users";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id").primary();
      table
        .integer("role_id")
        .unsigned()
        .references("roles.id")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      table.string("email").notNullable().unique().index();
      table.string("password").notNullable();
      table.boolean("is_account_activated").notNullable().defaultTo(0);
      table.boolean("remember_token").nullable();
      table.boolean("banned").notNullable().defaultTo(0);
      table.string("activation_code").nullable().index().unique();
      table.boolean("login_status").defaultTo(0);
      table.integer("forgot_password_code").nullable().unique();
      table.boolean("is_email_verified").notNullable().defaultTo(0);
      table.timestamp("last_login_time").nullable();
      table.timestamp("account_activated_at").nullable();
      table.timestamp("email_verified_at").nullable();

      /**
       * Uses timestampz for PostgreSQL and DATETIME2 for MSSQL
       */
      table
        .timestamp("created_at", { useTz: true })
        .notNullable()
        .defaultTo(this.now());
      table
        .timestamp("updated_at", { useTz: true })
        .notNullable()
        .defaultTo(this.now());
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
