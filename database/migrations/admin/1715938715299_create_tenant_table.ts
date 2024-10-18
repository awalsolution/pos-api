import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'tenants'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('plan_id')
        .unsigned()
        .defaultTo(1)
        .references('id')
        .inTable('plans')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.string('domain_name').notNullable().unique()
      table.string('tenant_name').nullable()
      table.text('db_name').nullable()
      table.text('tenant_api_key').nullable()
      table.string('created_by').notNullable().defaultTo('online registration')
      table.boolean('status').notNullable().defaultTo(false)
      table.boolean('activated').notNullable().defaultTo(false)
      table.string('name').nullable()
      table.string('email').nullable()
      table.string('phone_number').nullable()
      table.string('address').nullable()
      table.string('city').nullable()
      table.string('state').nullable()
      table.string('country').nullable()
      table.string('logo').nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
