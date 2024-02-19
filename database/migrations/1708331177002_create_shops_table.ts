import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'shops'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('shop_name').notNullable().unique()
      table.string('shop_phone').nullable().unique()
      table.boolean('status').notNullable().defaultTo(true)
      table.string('address').nullable()
      table.string('city').nullable()
      table.string('state').nullable()
      table.string('country').nullable()
      table.string('shop_logo').nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
