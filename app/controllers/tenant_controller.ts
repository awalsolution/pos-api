import { DateTime } from 'luxon'
import logger from '@adonisjs/core/services/logger'
import { HttpContext } from '@adonisjs/core/http'
import { BaseController } from '#controllers/base_controller'
import { tenantConnectionPatch } from '#services/db_connection_switcher_service'
import SingleTenantInsertPermissionEvent from '#events/single_tenant_insert_permission_event'
import Tenant from '#models/tenant'
import Permission from '#models/permission'
import Role from '#models/role'
import User from '#models/user'
import Plan from '#models/plan'
import Menu from '#models/menu'
import { cuid } from '@adonisjs/core/helpers'

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
      logger.info(`Tenant ==> ${DQ.tenant_name} updated successfully!`)
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
        const plan = await Plan.query()
          .preload('permissions', (sq) => sq.preload('menus'))
          .where('id', DQ.planId!)
          .first()
        if (plan && request.body().role_id && plan.permissions.length > 0) {
          const dbName: string = `tenant_${cuid()}_db`
          const tenantApiKey = `tenant_${cuid()}_api_key`
          DQ.status = 1
          DQ.activated = 1
          DQ.db_name = dbName
          DQ.tenant_api_key = tenantApiKey
          await DQ.save()
          await this.createDatabase(dbName)
          logger.info(`Database: ${dbName} created Successfully!`)
          await this.dealsWithMigrations(dbName)

          const role: any = await Role.query().where('id', request.body().role_id).first()

          await tenantConnectionPatch(dbName)

          let allPermissions = []
          if (plan.permissions) {
            for (const item of plan.permissions) {
              const mExist = await Menu.query({ connection: 'tenant' })
                .where('name', item.menus.name)
                .first()
              let menu = mExist
              if (!mExist) {
                menu = await Menu.create(
                  {
                    name: item.menus.name,
                    type: item.menus.type,
                    status: item.status,
                    created_by: 'system',
                  },
                  { connection: 'tenant' }
                )
              }
              const data = await Permission.create(
                {
                  menuId: menu?.id,
                  name: item.name,
                  type: item.type,
                  status: item.status,
                  created_by: 'system',
                },
                { connection: 'tenant' }
              )
              allPermissions.push(data.id)
              logger.info(`Permissions Inserted into tenant database: ${dbName} Successfully!`)
            }
          }

          const createdRole = await Role.create(
            { name: role.name, created_by: 'system' },
            { connection: 'tenant' }
          )
          logger.info(`Role Inserted into tenant database: ${dbName} Successfully!`)
          createdRole.related('permissions').sync(allPermissions)
          logger.info(
            `Permissions Assign to ${createdRole.name} into tenant database: ${dbName} successfully!`
          )

          const user = new User().useConnection('tenant')

          user.email = DQ.email!
          user.password = 'admin@123'
          user.is_email_verified = 1
          user.email_verified_at = DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss')
          user.is_phone_verified = 1
          user.phone_verified_at = DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss')
          user.phone_number = DQ.phone_number
          user.created_by = 'system'

          await user.save()
          logger.info(`Admin User Inserted into tenant database: ${dbName} successfully!`)

          await user.related('roles').sync([createdRole.id])

          logger.info(
            `${createdRole.name} Assign to admin user into tenant database: ${dbName} successfully!`
          )

          return response.ok({
            code: 200,
            message: 'Activated Successfully!',
            data: null,
          })
        } else {
          return response.notFound({
            code: 400,
            message: 'Please select role! & Assign permissions to plan first!',
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
  // update plan of tenant
  async EditPlan({ request, response }: HttpContext) {
    try {
      const DQ = await Tenant.findBy('id', request.param('id'))
      if (!DQ) {
        return response.notFound({
          code: 400,
          message: 'Data does not exists!',
        })
      }

      DQ.planId = request.body().id
      await DQ.save()

      // event to update the tenant permissions
      await SingleTenantInsertPermissionEvent.dispatch({
        plan_id: request.body().id,
        db: DQ.db_name,
      })

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

      const perm = await Permission.all({ connection: 'tenant' })
      const roles = await Role.query({ connection: 'tenant' }).where('created_by', 'system')
      const users = await User.query({ connection: 'tenant' })
        .preload('roles')
        .where('created_by', 'system')

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

  // find tenant profile
  async findTenantProfile({ request, response }: HttpContext) {
    try {
      const DQ = await Tenant.query()
        .where('tenant_api_key', request.param('apiKey'))
        .select('id', 'phone_number', 'address', 'city', 'state', 'country', 'logo')
        .first()

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
  // edit tenant profile
  async EditTenantProfile({ request, response }: HttpContext) {
    try {
      const DQ = await Tenant.query().where('id', request.param('id')).first()

      if (!DQ) {
        return response.notFound({
          code: 400,
          message: 'Data does not exists!',
        })
      }

      DQ.phone_number = request.body().phone_number
      DQ.address = request.body().address
      DQ.city = request.body().city
      DQ.state = request.body().state
      DQ.country = request.body().country
      DQ.logo = request.body().logo

      await DQ.save()
      logger.info(`Tenant ==> ${DQ.tenant_name} profile is updated successfully!`)
      return response.ok({
        code: 200,
        message: 'Update successfully!',
        data: DQ,
      })
    } catch (e) {
      return response.internalServerError({
        code: 500,
        message: e.toString(),
      })
    }
  }

  // delete permission of tenant from tenant db
  async deletePermissionOfTenant({ request, response }: HttpContext) {
    try {
      const tenant: any = await Tenant.findBy('id', request.input('tenant_id'))

      await tenantConnectionPatch(tenant.db_name)

      const DQ = await Permission.findBy('id', request.param('id'), { connection: 'tenant' })
      if (!DQ) {
        return response.notFound({
          code: 400,
          message: 'Data not found',
        })
      }
      await DQ.delete()

      logger.info('Delete permission of tenant successfully!')

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
