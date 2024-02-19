import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'permissions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('menu_id')
        .unsigned()
        .references('id')
        .inTable('menus')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.string('type').notNullable()
      table.string('name').notNullable().unique()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
