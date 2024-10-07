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
      table.string('name').notNullable().unique()
      table.string('type').notNullable().defaultTo('public')
      table.boolean('status').notNullable().defaultTo(true)
      table.string('created_by').nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
