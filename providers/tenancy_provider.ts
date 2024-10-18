import type { ApplicationService } from '@adonisjs/core/types'
import { Database } from '@adonisjs/lucid/database'
import { BaseModel } from '@adonisjs/lucid/orm'
import TenantAdapter from '#models/adapters/tenant_adapter'

export default class TenancyProvider {
  constructor(protected app: ApplicationService) {}

  async boot() {
    const db = await this.app.container.make(Database)
    BaseModel.$adapter = new TenantAdapter(db)
  }
}
