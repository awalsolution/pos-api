import app from '@adonisjs/core/services/app'
import db from '@adonisjs/lucid/services/db'
import { HttpContext } from '@adonisjs/core/http'
import { MigrationRunner } from '@adonisjs/lucid/migration'
import { cuid } from '@adonisjs/core/helpers'
import {
  tenantConnectionSwitcher,
  adminConnectionSwitcher,
} from '#services/db_connection_switcher_service'
import Tenant from '#models/tenant'
import ace from '@adonisjs/core/services/ace'

export default class TenantController {
  async index({ request, response }: HttpContext) {
    let DQ = Tenant.query()

    const page = request.input('page')
    const perPage = request.input('perPage')

    if (request.input('name')) {
      DQ = DQ.whereILike('name', request.input('name') + '%')
    }

    if (perPage) {
      return response.ok({
        code: 200,
        data: await DQ.preload('plan').paginate(page, perPage),
        message: 'Record find successfully!',
      })
    } else {
      return response.ok({
        code: 200,
        data: await DQ.preload('plan'),
        message: 'Record find successfully!',
      })
    }
  }

  async show({ request, response }: HttpContext) {
    try {
      const DQ = await Tenant.query().where('id', request.param('id')).preload('plan').first()

      if (!DQ) {
        return response.notFound({
          code: 400,
          message: 'Data does not exists!',
        })
      }

      return response.ok({
        code: 200,
        message: 'Record find successfully!',
        data: DQ,
      })
    } catch (e) {
      return response.internalServerError({
        code: 500,
        message: e.toString(),
      })
    }
  }

  async create({ auth, request, response }: HttpContext) {
    try {
      const currentUser = auth.user!
      // db name generation
      const dbName: string = `tenant_${cuid()}_db`

      const DE = await Tenant.findBy('domain_name', request.body().domain_name)

      if (DE) {
        return response.conflict({
          code: 409,
          message: `Domain ${request.body().domain_name} already exists!`,
        })
      } else {
        try {
          await this.createDatabase(dbName)
          await this.dealsWithMigrations(dbName)

          const DM = new Tenant()

          DM.planId = request.body().plan_id || 1
          DM.domain_name = request.body().domain_name
          DM.db_name = dbName
          DM.tenant_api_key = `tenant_${cuid()}_key`
          DM.first_name = request.body().first_name
          DM.last_name = request.body().last_name
          DM.email = request.body().email
          DM.phone_number = request.body().phone_number
          DM.password = request.body().password
          DM.status = request.body().status
          DM.created_by = currentUser?.profile?.first_name! + currentUser?.profile?.last_name

          const DQ = await DM.save()

          return response.ok({
            code: 200,
            message: 'Created successfully!',
            data: DQ,
          })
        } catch (error) {
          return response.conflict({
            code: 409,
            message: error.sqlMessage || 'Database creation failed.',
          })
        }
      }
    } catch (e) {
      console.log(e)
      return response.internalServerError({
        code: 500,
        message: e.toString(),
      })
    }
  }

  async update({ request, response }: HttpContext) {
    try {
      const DQ = await Tenant.findBy('id', request.param('id'))
      if (!DQ) {
        return response.notFound({
          code: 400,
          message: 'Data does not exists!',
        })
      }
      const DE = await Tenant.query()
        .where('name', 'like', request.body().name)
        .whereNot('id', request.param('id'))
        .first()

      if (DE) {
        return response.conflict({
          code: 409,
          message: 'Record already exist!',
        })
      }

      DQ.db_name = request.body().name

      await DQ.save()
      return response.ok({
        code: 200,
        message: 'Updated successfully!',
        data: DQ,
      })
    } catch (e) {
      console.log(e)
      return response.internalServerError({
        code: 500,
        message: e.message,
      })
    }
  }

  async destroy({ request, response }: HttpContext) {
    const DQ = await Tenant.findBy('id', request.param('id'))
    if (!DQ) {
      return response.notFound({
        code: 400,
        message: 'Data not found',
      })
    }
    await DQ.delete()
    return response.ok({
      code: 200,
      message: 'Deleted successfully!',
    })
  }

  async createDatabase(db_name: string): Promise<boolean> {
    return db.rawQuery(`CREATE DATABASE ${db_name}`)
  }

  async deleteDatabase(db_name: string): Promise<boolean> {
    return db.rawQuery(`DROP DATABASE ${db_name}`)
  }

  async dealsWithMigrations(db_name: string) {
    try {
      await tenantConnectionSwitcher(db_name)
      const migrator = new MigrationRunner(db, app, {
        direction: 'up',
        dryRun: false,
      })

      await migrator.run()
      await ace.exec('db:seed', [''])
      await adminConnectionSwitcher()

      return true
    } catch (error) {
      console.error('An error occurred during migration:', error)
      return false
    }
  }
}
