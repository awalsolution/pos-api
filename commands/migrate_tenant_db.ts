import { tenantConnectionPatch } from '#services/db_connection_switcher_service'
import { args, BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import { MigrationRunner } from '@adonisjs/lucid/migration'
import logger from '@adonisjs/core/services/logger'
import app from '@adonisjs/core/services/app'

export default class MigrateTenantDb extends BaseCommand {
  static commandName = 'migrate:tenant-db'
  static description = 'Run migrations for a specific database'
  static options: CommandOptions = { startApp: true }

  @args.string()
  declare dbName: string

  async run() {
    const dbName = this.dbName
    const db = await this.app.container.make('lucid.db')
    await tenantConnectionPatch(dbName)

    const migrator = new MigrationRunner(db, app, {
      direction: 'up',
      dryRun: false,
      connectionName: 'tenant',
    })

    await migrator.run()
    for (const migratedFile in migrator.migratedFiles) {
      const status =
        migrator.migratedFiles[migratedFile].status === 'completed'
          ? 'migrated'
          : migrator.migratedFiles[migratedFile].status
      logger.info(`[${status}] ==> [${migrator.migratedFiles[migratedFile].file.name}]`)
    }
  }
}
