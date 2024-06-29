import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'tenants'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('plan_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('plans')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.string('domain_name').nullable().unique()
      table.string('tenant_name').notNullable()
      table.string('db_name').notNullable()
      table.text('tenant_api_key').notNullable()
      table.string('created_by').nullable()
      table.boolean('status').notNullable().defaultTo(false)
      table.string('first_name').nullable()
      table.string('last_name').nullable()
      table.string('email').nullable()
      table.string('phone_number').nullable()
      table.string('address').nullable()
      table.string('city').nullable()
      table.string('state').nullable()
      table.string('country').nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
