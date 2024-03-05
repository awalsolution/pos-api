import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'variant_attributes'

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
        .integer('attribute_id')
        .unsigned()
        .references('id')
        .inTable('attributes')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.string('option')

      table.unique(['variant_id', 'attribute_id', 'option'])

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
