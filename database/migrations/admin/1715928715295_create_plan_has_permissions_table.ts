import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'plan_has_permissions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('plan_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('plans')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table
        .integer('permission_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('permissions')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')

      table.unique(['plan_id', 'permission_id'])

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
