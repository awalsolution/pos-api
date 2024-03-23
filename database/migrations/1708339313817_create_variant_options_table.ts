import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'variant_options'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('variant_id')
        .unsigned()
        .references('id')
        .inTable('variants')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table
        .integer('attribute_value_id')
        .unsigned()
        .references('id')
        .inTable('attribute_values')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
