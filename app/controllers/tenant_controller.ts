import db from '@adonisjs/lucid/services/db'
import string from '@adonisjs/core/helpers/string'
import logger from '@adonisjs/core/services/logger'
import { HttpContext } from '@adonisjs/core/http'
import { tenantConnectionPatch } from '#services/db_connection_switcher_service'
import { BaseController } from '#controllers/base_controller'
import Tenant from '#models/tenant'
import Permission from '#models/permission'
import Role from '#models/role'
import User from '#models/user'
import Plan from '#models/plan'

export default class TenantController extends BaseController {
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
        data: await DQ.preload('plan').orderBy('created_at', 'desc').paginate(page, perPage),
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
      const DE = await Tenant.findBy('domain_name', request.body().domain_name)

      if (DE) {
        return response.conflict({
          code: 409,
          message: `Domain ${request.body().domain_name} already exists!`,
        })
      }

      const DM = new Tenant()

      DM.planId = request.body().plan_id || 1
      DM.tenant_name = request.body().tenant_name
      DM.domain_name = request.body().domain_name
      DM.phone_number = request.body().phone_number
      DM.email = request.body().email
      DM.created_by = currentUser?.name

      const DQ = await DM.save()

      logger.info(`Tenant created Successfully! with id: ${DQ.id} and domain:${DQ.domain_name}`)

      return response.ok({
        code: 200,
        message: 'Created successfully!',
        data: DQ,
      })
    } catch (e) {
      logger.error('Something went wrong!', e.toString())
      return response.internalServerError({
        code: 500,
        message: `Something went wrong! ${e.toString()}`,
      })
    }
  }

  async update({ auth, request, response }: HttpContext) {
    try {
      const currentUser = auth.user!
      const DQ = await Tenant.findBy('id', request.param('id'))
      if (!DQ) {
        return response.notFound({
          code: 400,
          message: 'Data does not exists!',
        })
      }
      const DE = await Tenant.query()
        .where('domain_name', 'like', request.body().domain_name)
        .whereNot('id', request.param('id'))
        .first()

      if (DE) {
        return response.conflict({
          code: 409,
          message: 'Already exist!',
        })
      }

      DQ.planId = request.body().plan_id || 1
      DQ.tenant_name = request.body().tenant_name
      DQ.domain_name = request.body().domain_name
      DQ.phone_number = request.body().phone_number
      DQ.email = request.body().email
      DQ.created_by = currentUser?.name

      await DQ.save()

      return response.ok({
        code: 200,
        message: 'Updated successfully!',
        data: DQ,
      })
    } catch (e) {
      logger.error('Something went wrong!', e.toString())
      return response.internalServerError({
        code: 500,
        message: e.message,
      })
    }
  }

  async destroy({ request, response }: HttpContext) {
    try {
      const DQ = await Tenant.findBy('id', request.param('id'))
      if (!DQ) {
        return response.notFound({
          code: 400,
          message: 'Data not found',
        })
      }
      await DQ.delete()
      logger.info(`Tenant ${DQ.domain_name} is deleted successfully!`)
      return response.ok({
        code: 200,
        message: 'Deleted successfully!',
      })
    } catch (e) {
      logger.error('Something went wrong!', e.toString())
      return response.internalServerError({
        code: 500,
        message: e.message,
      })
    }
  }

  //  new tenant registration and activation
  async tenantActivation({ request, response }: HttpContext) {
    try {
      const DQ = await Tenant.findBy('id', request.param('id'))
      if (!DQ) {
        return response.notFound({
          code: 400,
          message: 'Data does not exists!',
        })
      }

      if (request.body().status === 0) {
        DQ.status = request.body().status
        await DQ.save()
        logger.info(`Tenant with DB: ${DQ.db_name} Deactivated Successfully!`)
        return response.ok({
          code: 200,
          message: 'Deactivated Successfully!',
          data: DQ,
        })
      } else if (DQ.activated === 1) {
        DQ.status = 1
        await DQ.save()
        logger.info(
          `Tenant with DB: ${DQ.db_name} Already Activated! and status will be changed successfully!`
        )
        return response.ok({
          code: 200,
          message: 'Already Activated! and status will be changed successfully!',
          data: DQ,
        })
      } else {
        const plan: any = await Plan.query().preload('permissions').where('id', DQ.planId!).first()
        if (request.body().role_id && plan.permissions.length > 0) {
          const dbName: string = `tenant_${string.snakeCase(DQ.tenant_name)}_db`
          const tenantApiKey = `tenant_${string.snakeCase(DQ.tenant_name)}_api_key`
          DQ.status = 1
          DQ.activated = 1
          DQ.db_name = dbName
          DQ.tenant_api_key = tenantApiKey
          await DQ.save()
          await this.createDatabase(dbName)
          logger.info(`Database: ${dbName} created Successfully!`)
          await this.dealsWithMigrations(dbName)

          db.primaryConnectionName = 'mysql'

          const role: any = await Role.query().where('id', request.body().role_id).first()

          // console.log(DQ.planId!)

          await tenantConnectionPatch(dbName)
          db.primaryConnectionName = 'tenant'

          let allPermissions = []
          if (plan.permissions) {
            for (const item of plan.permissions) {
              const data = await Permission.create({
                name: item.name,
                type: item.type,
                created_by: 'system',
              })
              allPermissions.push(data.id)
              logger.info(`Permissions Inserted into tenant database: ${dbName} Successfully!`)
            }
          }

          const createdRole = await Role.create({ name: role.name, created_by: 'system' })
          logger.info(`Role Inserted into tenant database: ${dbName} Successfully!`)
          createdRole.related('permissions').sync(allPermissions)
          logger.info(
            `Permissions Assign to ${createdRole.name} into tenant database: ${dbName} successfully!`
          )

          const user: any = new User()

          user.email = DQ.email
          user.password = '123456'
          user.status = request.body().status
          user.phone_number = DQ.phone_number
          user.created_by = 'system'

          await user.save()
          logger.info(`Admin User Inserted into tenant database: ${dbName} successfully!`)

          await user.related('roles').sync([createdRole.id])

          logger.info(
            `${createdRole.name} Assign to admin user into tenant database: ${dbName} successfully!`
          )
          db.primaryConnectionName = 'mysql'
          return response.ok({
            code: 200,
            message: 'Activated Successfully!',
            data: null,
          })
        } else {
          return response.notFound({
            code: 400,
            message: 'Please select role! & plan have no permissions',
            data: null,
          })
        }
      }
    } catch (e) {
      logger.error('Something went wrong!', e.toString())
      return response.internalServerError({
        code: 500,
        message: e.message,
      })
    }
  }

  //  find all info of the tenant from it's db
  async tenantDetailInfo({ request, response }: HttpContext) {
    try {
      const DQ = await Tenant.findBy('db_name', request.input('db_name'))
      if (!DQ) {
        return response.notFound({
          code: 400,
          message: 'Tenant does not exists! Please contact with support!',
        })
      }
      await tenantConnectionPatch(request.input('db_name'))
      db.primaryConnectionName = 'tenant'

      const perm = await Permission.all()
      const roles = await Role.all()
      const users = await User.query().preload('roles')

      db.primaryConnectionName = 'mysql'

      return response.ok({
        code: 200,
        message: 'find successfully!',
        data: { permissions: perm, users: users, roles: roles },
      })
    } catch (e) {
      logger.error('Something went wrong!', e.toString())
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
      logger.error('Something went wrong!', e.toString())
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

      logger.info(`Permissions assign to ${DQ.name} successfully!`)
      db.primaryConnectionName = 'mysql'
      return response.ok({
        code: 200,
        message: 'assign successfully!',
        data: DQ,
      })
    } catch (e) {
      logger.error('Something went wrong!', e.toString())
      return response.internalServerError({
        code: 500,
        message: e.message,
      })
    }
  }

  async findSingleUserOfTenant({ request, response }: HttpContext) {
    try {
      await tenantConnectionPatch(request.input('db_name'))
      db.primaryConnectionName = 'tenant'

      const DQ = await User.query().where('id', request.input('user_id')).preload('roles').first()

      logger.info('Find single user of tenant successfully!')

      db.primaryConnectionName = 'mysql'

      return response.ok({
        code: 200,
        message: 'Record find successfully!',
        data: DQ,
      })
    } catch (e) {
      logger.error('Something went wrong!', e.toString())
      return response.internalServerError({
        code: 500,
        message: e.toString(),
      })
    }
  }

  async updateUserOfTenant({ auth, request, response }: HttpContext) {
    try {
      const currentUser = auth.user!
      await tenantConnectionPatch(request.input('db_name'))
      db.primaryConnectionName = 'tenant'

      const DQ = await User.findBy('id', request.param('user_id'))
      if (!DQ) {
        return response.notFound({
          code: 400,
          message: 'Data not found',
        })
      }

      DQ.name = request.body().name
      DQ.email = request.body().email
      DQ.password = request.body().password
      DQ.status = request.body().status
      DQ.phone_number = request.body().phone_number
      DQ.address = request.body().address
      DQ.city = request.body().city
      DQ.state = request.body().state
      DQ.country = request.body().country
      DQ.created_by = currentUser?.name

      DQ.related('roles').sync(request.body().roles)

      await DQ.save()

      logger.info(`Update user ${DQ.name} of tenant successfully!`)

      db.primaryConnectionName = 'mysql'

      return response.ok({
        code: 200,
        message: 'Update successfully!',
        data: DQ,
      })
    } catch (e) {
      logger.error('Something went wrong!', e.toString())
      return response.internalServerError({
        code: 500,
        message: e.message,
      })
    }
  }

  // Insert Role of tenant into tenant database
  async InsertRoleOfTenant({ request, response }: HttpContext) {
    try {
      await tenantConnectionPatch(request.input('db_name'))
      db.primaryConnectionName = 'tenant'

      let data: any = []
      if (request.body().roles.length > 0) {
        for (const role of request.body().roles) {
          const DE = await Role.findBy('name', role)
          if (DE) {
            return response.conflict({
              code: 409,
              message: `Role ${role} already exists!`,
            })
          }
          data = await Role.create({ name: role })

          logger.info(
            `Role: ${role} Inserted into tenant database: ${request.input('db_name')} successfully!`
          )
        }
      } else {
        return response.badRequest({
          code: 400,
          message: `Something went wrong! Roles not insert successfully!`,
          data: null,
        })
      }

      db.primaryConnectionName = 'mysql'

      return response.ok({
        code: 200,
        message: `Role Inserted into tenant database: ${request.input('db_name')} successfully!`,
        data: data,
      })
    } catch (e) {
      logger.error('Something went wrong!', e.toString())
      return response.internalServerError({
        code: 500,
        message: e.toString(),
      })
    }
  }

  // find All roles of tenant from tenant database
  async findRolesOfTenant({ request, response }: HttpContext) {
    try {
      await tenantConnectionPatch(request.input('db_name'))
      db.primaryConnectionName = 'tenant'

      let DQ = Role.query()

      let data = await DQ.preload('permissions')

      logger.info('Find roles of tenant successfully!')

      db.primaryConnectionName = 'mysql'

      return response.ok({
        code: 200,
        data: data,
        message: 'Record find successfully!',
      })
    } catch (e) {
      logger.error('Something went wrong!', e.toString())
      return response.internalServerError({
        code: 500,
        message: e.message,
      })
    }
  }

  // delete role of tenant from tenant database
  async deleteRoleOfTenant({ request, response }: HttpContext) {
    try {
      await tenantConnectionPatch(request.input('db_name'))
      db.primaryConnectionName = 'tenant'

      const DQ = await Role.findBy('id', request.input('role_id'))
      if (!DQ) {
        return response.notFound({
          code: 400,
          message: 'Data not found',
        })
      }
      await DQ.delete()

      logger.info('Delete role of tenant successfully!')

      db.primaryConnectionName = 'mysql'

      return response.ok({
        code: 200,
        message: 'Deleted successfully!',
      })
    } catch (e) {
      logger.error('Something went wrong!', e.toString())
      return response.internalServerError({
        code: 500,
        message: e.message,
      })
    }
  }

  // Insert Permissons of tenant into tenant database
  async InsertPermissionsOfTenant({ request, response }: HttpContext) {
    try {
      await tenantConnectionPatch(request.input('db_name'))
      db.primaryConnectionName = 'tenant'

      let data: any = []
      if (request.body().permissions.length > 0) {
        for (const permission of request.body().permissions) {
          const DE = await Permission.findBy('name', permission)
          if (!DE) {
            data = await Permission.create({ name: permission })
            logger.info(
              `Permission: ${permission} Inserted into tenant database: ${request.input('db_name')} successfully!`
            )
          }
        }
      } else {
        return response.badRequest({
          code: 400,
          message: `Something went wrong! Permissions not insert successfully!`,
          data: null,
        })
      }

      db.primaryConnectionName = 'mysql'

      return response.ok({
        code: 200,
        message: `Permission Inserted into tenant database: ${request.input('db_name')} successfully!`,
        data: data,
      })
    } catch (e) {
      logger.error('Something went wrong!', e.toString())
      return response.internalServerError({
        code: 500,
        message: e.toString(),
      })
    }
  }

  // find All permissions of tenant from tenant database
  async findPermssionsOfTenant({ request, response }: HttpContext) {
    try {
      await tenantConnectionPatch(request.input('db_name'))
      db.primaryConnectionName = 'tenant'

      let DQ = Permission.query()

      const page = request.input('page')
      const perPage = request.input('perPage')
      let data

      if (perPage) {
        data = await DQ.paginate(page, perPage)
      } else {
        data = await DQ.select('*')
      }

      logger.info('Find Permissions of tenant successfully!')

      db.primaryConnectionName = 'mysql'

      return response.ok({
        code: 200,
        data: data,
        message: 'Record find successfully!',
      })
    } catch (e) {
      logger.error('Something went wrong!', e.toString())
      return response.internalServerError({
        code: 500,
        message: e.message,
      })
    }
  }

  async deletePermissionOfTenant({ request, response }: HttpContext) {
    try {
      await tenantConnectionPatch(request.input('db_name'))
      db.primaryConnectionName = 'tenant'

      const DQ = await Permission.findBy('id', request.param('permission_id'))
      if (!DQ) {
        return response.notFound({
          code: 400,
          message: 'Data not found',
        })
      }
      await DQ.delete()

      logger.info('Delete permission of tenant successfully!')

      db.primaryConnectionName = 'mysql'

      return response.ok({
        code: 200,
        message: 'Deleted successfully!',
      })
    } catch (e) {
      logger.error('Something went wrong!', e.toString())
      return response.internalServerError({
        code: 500,
        message: e.message,
      })
    }
  }
}
