import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import Tenant from '#models/tenant'
import db from '@adonisjs/lucid/services/db'
import { tenantConnectionPatch } from '#services/db_connection_switcher_service'
import { MigrationRunner } from '@adonisjs/lucid/migration'
import app from '@adonisjs/core/services/app'
import logger from '@adonisjs/core/services/logger'
export class BaseController {
  async checkRole(user?: User, role?: string) {
    if (user?.roles && user.roles.length) {
      const roles = user.roles.filter((userRole) => userRole.name === role)
      return roles.length > 0
    }
    return false
  }

  async isSuperAdmin(user?: User) {
    return this.checkRole(user, 'super admin')
  }

  async isTenant(ctx: HttpContext) {
    if (ctx.request.header('X-Tenant-Api-Key')) {
      const tenant = await Tenant.findBy('tenant_api_key', ctx.request.header('X-Tenant-Api-Key'), {
        connection: 'mysql',
      })
      return tenant?.serialize()
    }
  }

  async createDatabase(db_name: string): Promise<boolean> {
    return db.rawQuery(`CREATE DATABASE ${db_name}`)
  }

  async deleteDatabase(db_name: string): Promise<boolean> {
    return db.rawQuery(`DROP DATABASE ${db_name}`)
  }

  async dealsWithMigrations(db_name: string) {
    try {
      await tenantConnectionPatch(db_name)
      db.primaryConnectionName = 'tenant'

      const migrator = new MigrationRunner(db, app, {
        direction: 'up',
        dryRun: false,
      })

      await migrator.run()
      for (const migratedFile in migrator.migratedFiles) {
        const status =
          migrator.migratedFiles[migratedFile].status === 'completed'
            ? 'migrated'
            : migrator.migratedFiles[migratedFile].status
        logger.info(`[${status}] ==> [${migrator.migratedFiles[migratedFile].file.name}]`)
      }

      return true
    } catch (error) {
      logger.error('An error occurred during migration:', error)
      return false
    }
  }
}
