import db from '@adonisjs/lucid/services/db'
import logger from '@adonisjs/core/services/logger'
import { HttpContext } from '@adonisjs/core/http'
import { cuid } from '@adonisjs/core/helpers'
import { tenantConnectionPatch } from '#services/db_connection_switcher_service'
import { BaseController } from '#controllers/base_controller'
import Tenant from '#models/tenant'
import Permission from '#models/permission'
import Role from '#models/role'
import User from '#models/user'

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
          logger.info(`Database: ${dbName} created Successfully!`)
          await this.dealsWithMigrations(dbName)

          let permArr = []

          if (request.body().permissions) {
            for (const permission of request.body().permissions) {
              const res = await Permission.create({ name: permission })
              permArr.push(res.id)
              logger.info(`Permissions Inserted into tenant database: ${dbName} Successfully!`)
            }
          } else {
            logger.error('Something went wrong! Permissions not insert successfully!')
            return response.badRequest({
              code: 400,
              message: 'Something went wrong! User not insert successfully!',
            })
          }
          let createdRole: any = []
          if (request.body().roles) {
            for (const role of request.body().roles) {
              createdRole = await Role.create({ name: role })
              logger.info(`Role Inserted into tenant database: ${dbName} Successfully!`)
              const newRole: any = await Role.find(createdRole.id)
              await newRole.related('permissions').sync(permArr)
              logger.info(
                `Permissions Assign to tenant role into tenant database: ${dbName} Successfully!`
              )
            }
          } else {
            logger.error('Something went wrong! Roles not insert successfully!')
            return response.badRequest({
              code: 400,
              message: 'Something went wrong! Roles not insert successfully!',
            })
          }

          if (request.body().email) {
            const user = new User()

            user.email = request.body().email
            user.password = request.body().password
            user.status = request.body().status

            await user.save()
            logger.info(`Admin User Inserted into tenant database: ${dbName} Successfully!`)

            await user.related('profile').create({
              first_name: request.body().first_name,
              last_name: request.body().last_name,
              phone_number: request.body().phone_number,
              address: request.body().address,
              city: request.body().city,
              state: request.body().state,
              country: request.body().country,
            })
            await user.related('roles').sync([createdRole.id])
            logger.info(
              `${createdRole.name} Assign to admin user into tenant database: ${dbName} Successfully!`
            )
          } else {
            logger.error('Something went wrong! User not insert successfully!')
            return response.badRequest({
              code: 400,
              message: 'Something went wrong! User not insert successfully!',
            })
          }

          db.primaryConnectionName = 'mysql'

          const DM = new Tenant()

          DM.planId = request.body().plan_id || 1
          DM.domain_name = request.body().domain_name
          DM.db_name = dbName
          DM.tenant_name = request.body().tenant_name
          DM.tenant_api_key = `tenant_${cuid()}_key`
          DM.status = request.body().status
          DM.created_by = currentUser?.profile?.first_name! + ' ' + currentUser?.profile?.last_name
          DM.address = request.body().address
          DM.city = request.body().city
          DM.state = request.body().state
          DM.country = request.body().country
          DM.first_name = request.body().first_name
          DM.last_name = request.body().last_name
          DM.email = request.body().email
          DM.phone_number = request.body().phone_number

          const DQ = await DM.save()

          logger.info(`Tenant Created Successfully! with id: ${DQ.id} and Domain:${DQ.domain_name}`)

          return response.ok({
            code: 200,
            message: 'Created successfully!',
            data: DQ,
          })
        } catch (e) {
          logger.error('Something went wrong!', e.toString())
          return response.badRequest({
            code: 400,
            message: `Something went wrong! ${e.toString()}`,
          })
        }
      }
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
          message: 'Record already exist!',
        })
      }

      DQ.planId = request.body().plan_id || 1
      DQ.domain_name = request.body().domain_name
      DQ.status = request.body().status
      DQ.created_by = currentUser?.profile?.first_name! + ' ' + currentUser?.profile?.last_name

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
      const users = await User.query().preload('profile').preload('roles')

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

      logger.info('find single user of tenant successfully!')

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

  async updateUserOfTenant({ request, response }: HttpContext) {
    try {
      await tenantConnectionPatch(request.input('db_name'))
      db.primaryConnectionName = 'tenant'

      const DQ = await User.findBy('id', request.param('user_id'))
      if (!DQ) {
        return response.notFound({
          code: 400,
          message: 'Data not found',
        })
      }

      DQ.email = request.body().email
      DQ.status = request.body().status

      DQ.related('roles').sync(request.body().roles)

      await DQ.save()

      logger.info('Update User of tenant successfully!')

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
            `Role: ${role} Inserted into tenant database: ${request.input('db_name')} Successfully!`
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
        message: `Role Inserted into tenant database: ${request.input('db_name')} Successfully!`,
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

      logger.info('find roles of tenant successfully!')

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

      logger.info('delete role of tenant successfully!')

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
              `Permission: ${permission} Inserted into tenant database: ${request.input('db_name')} Successfully!`
            )
          }
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
        message: `Permission Inserted into tenant database: ${request.input('db_name')} Successfully!`,
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

      logger.info('find Permissions of tenant successfully!')

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

      logger.info('delete Permission of tenant successfully!')

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
