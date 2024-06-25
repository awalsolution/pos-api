import app from '@adonisjs/core/services/app'
import db from '@adonisjs/lucid/services/db'
import { HttpContext } from '@adonisjs/core/http'
import { MigrationRunner } from '@adonisjs/lucid/migration'
import { cuid } from '@adonisjs/core/helpers'
import { tenantConnectionPatch } from '#services/db_connection_switcher_service'
import Tenant from '#models/tenant'
import Permission from '#models/permission'
import Role from '#models/role'
import User from '#models/user'
import logger from '@adonisjs/core/services/logger'

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
          logger.info(`Database ${dbName} created Successfully!`)
          await this.dealsWithMigrations(dbName)

          let permArr = []

          if (request.body().permissions) {
            for (const permission of request.body().permissions) {
              const res = await Permission.create({ name: permission })
              permArr.push(res.id)
            }
          } else {
            console.log('Something went wrong! Permissions not insert successfully!')
          }
          let createdRole: any = []
          if (request.body().roles) {
            for (const role of request.body().roles) {
              createdRole = await Role.create({ name: role })
              const newRole: any = await Role.find(createdRole.id)
              await newRole.related('permissions').sync(permArr)
            }
          } else {
            console.log('Something went wrong! Roles not insert successfully!')
          }

          if (request.body().email) {
            const user = new User()

            user.email = request.body().email

            user.password = request.body().password
            user.status = request.body().status

            await user.save()

            await user.related('profile').create({
              first_name: request.body().first_name,
              last_name: request.body().last_name,
              phone_number: request.body().phone_number,
            })
            await user.related('roles').sync([createdRole.id])
          } else {
            console.log('Something went wrong! User not insert successfully!')
          }

          db.primaryConnectionName = 'mysql'

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
          logger.error(error)
          return response.conflict({
            code: 409,
            message: error.toString(),
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

  async tenantDetailInfo({ request, response }: HttpContext) {
    try {
      const DQ = await Tenant.findBy('db_name', request.input('db_name'))
      if (!DQ) {
        return response.notFound({
          code: 400,
          message: 'Tenant does not exists! Please contact with support!',
        })
      }

      db.primaryConnectionName = 'tenant'

      const perm = await Permission.all()
      const roles = await Role.all()
      const users = await User.all()

      db.primaryConnectionName = 'mysql'

      return response.ok({
        code: 200,
        message: 'find successfully!',
        data: { permissions: perm, users: users, roles: roles },
      })
    } catch (e) {
      console.log(e)
      return response.internalServerError({
        code: 500,
        message: e.message,
      })
    }
  }

  async allPermission({ request, response }: HttpContext) {
    try {
      await tenantConnectionPatch(request.param('db_name'))
      db.primaryConnectionName = 'tenant'
      const perm = await Permission.all()
      const role = await Role.query()
        .where('id', request.input('role_id'))
        .preload('permissions')
        .first()
      db.primaryConnectionName = 'mysql'
      return response.ok({
        code: 200,
        message: 'find successfully!',
        data: { permissions: perm, role: role },
      })
    } catch (e) {
      console.log(e)
      return response.internalServerError({
        code: 500,
        message: e.message,
      })
    }
  }
  // assign permission to tenant role
  async assignPermission({ request, response }: HttpContext) {
    try {
      await tenantConnectionPatch(request.input('db_name'))
      db.primaryConnectionName = 'tenant'
      const DQ = await Role.findBy('id', request.param('id'))
      if (!DQ) {
        return response.notFound({
          code: 400,
          message: 'Data does not exists!',
        })
      }

      await DQ.related('permissions').sync(request.body().permissions)
      await DQ.save()
      db.primaryConnectionName = 'mysql'
      return response.ok({
        code: 200,
        message: 'assign successfully!',
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

  // tenant role delete
  async deleteTenantRole({ request, response }: HttpContext) {
    try {
      await tenantConnectionPatch(request.input('db_name'))
      db.primaryConnectionName = 'tenant'
      const DQ = await Role.findBy('id', request.param('id'))
      if (!DQ) {
        return response.notFound({
          code: 400,
          message: 'Data not found',
        })
      }
      await DQ.delete()
      db.primaryConnectionName = 'mysql'
      return response.ok({
        code: 200,
        message: 'Deleted successfully!',
      })
    } catch (e) {
      console.log(e)
      return response.internalServerError({
        code: 500,
        message: e.message,
      })
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
      // console.log(migrator)
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
      console.error('An error occurred during migration:', error)
      return false
    }
  }
}
