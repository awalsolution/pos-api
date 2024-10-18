import type { HttpContext } from '@adonisjs/core/http'
import { cuid } from '@adonisjs/core/helpers'
import { BaseController } from '#controllers/base_controller'
import User from '#models/user'
import Tenant from '#models/tenant'
import logger from '@adonisjs/core/services/logger'
import db from '@adonisjs/lucid/services/db'

export default class AuthController extends BaseController {
  async register({ request, response }: HttpContext) {
    try {
      let DE = await User.findBy('email', request.body().email)
      if (DE && !DE.is_email_verified) {
        delete DE.$attributes.password

        return response.conflict({
          code: 409,
          message: 'Record already exists!',
        })
      }

      const user = new User()
      user.name = request.body().name
      user.email = request.body().email
      user.password = request.body().password
      user.phone_number = request.body().phone_number

      await user.save()

      return response.ok({
        code: 200,
        message: 'Register successfully!',
        data: user,
      })
    } catch (e) {
      console.log('register error', e.toString())
      return response.internalServerError({
        code: 500,
        message: e.toString(),
      })
    }
  }

  async login({ request, response }: HttpContext) {
    try {
      const { email, password } = request.only(['email', 'password'])
      const dq = await User.findBy('email', email)
      if (dq && !dq.is_email_verified) {
        return response.ok({
          code: 200,
          message: 'Pleae verify your email first!',
          data: null,
        })
      }

      const user = await User.verifyCredentials(email, password)
      const token = await User.accessTokens.create(user, ['*'], {
        name: 'login_token',
      })

      return response.ok({
        code: 200,
        message: 'Login successfully!',
        data: token,
      })
    } catch (e) {
      console.log(e)
      return response.internalServerError({
        code: 500,
        message: e.toString(),
      })
    }
  }

  async authenticated({ auth, response }: HttpContext) {
    const authenticatedUser = auth.user!
    if (!authenticatedUser) {
      return response.unauthorized({ code: 401, message: 'Unauthorized' })
    }
    delete authenticatedUser.$attributes.password

    return response.ok({
      code: 200,
      message: 'Record find successfully!',
      data: authenticatedUser,
    })
  }

  async logout({ auth, response }: HttpContext) {
    const currentUser = auth.user!
    await User.accessTokens.delete(currentUser, currentUser.currentAccessToken.identifier)
    return response.ok({
      code: 200,
      message: 'Logout successfully!',
    })
  }

  async tenantRegister({ request, response }: HttpContext) {
    try {
      // db name generation
      const dbName: string = `tenant_${cuid()}_db`

      const DE = await Tenant.findBy('tenant_name', request.body().tenant_name)

      if (DE) {
        return response.conflict({
          code: 409,
          message: `This Organization ${request.body().tenant_name} already exists!`,
        })
      } else {
        try {
          await this.createDatabase(dbName)
          logger.info(`Database: ${dbName} created Successfully!`)
          await this.dealsWithMigrations(dbName)

          if (request.body().email) {
            const user = new User()

            user.email = request.body().email
            user.password = request.body().password
            user.name = request.body().name
            user.phone_number = request.body().phone_number
            user.address = request.body().address
            user.city = request.body().city
            user.state = request.body().state
            user.country = request.body().country

            await user.save()

            logger.info(`Admin User Inserted into tenant database: ${dbName} Successfully!`)
          } else {
            logger.error('Something went wrong! User not insert successfully!')
            return response.badRequest({
              code: 400,
              message: 'Something went wrong! User not insert successfully!',
            })
          }

          db.primaryConnectionName = 'mysql'

          const DM = new Tenant()

          DM.db_name = dbName
          DM.tenant_name = request.body().tenant_name
          DM.tenant_api_key = `tenant_${cuid()}_key`
          DM.name = request.body().name
          DM.email = request.body().email
          DM.phone_number = request.body().phone_number
          DM.address = request.body().address
          DM.city = request.body().city
          DM.state = request.body().state
          DM.country = request.body().country

          const DQ = await DM.save()

          logger.info(`Tenant Created Successfully! with id: ${DQ.id} and Domain:${DQ.domain_name}`)

          return response.ok({
            code: 200,
            message: 'Created successfully!',
            data: DQ,
          })
        } catch (error) {
          logger.error(error)
          return response.badRequest({
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

  async verifyDomainName({ request, response }: HttpContext) {
    try {
      const DQ = await Tenant.query().where('domain_name', request.param('name')).first()

      if (!DQ) {
        return response.notFound({
          code: 400,
          message: `Domain ${request.param('name')} does not exists!`,
        })
      }

      if (DQ && !DQ.status) {
        return response.badRequest({
          code: 400,
          message: `Domain ${request.param('name')} is unverified! Please contact with Support!`,
        })
      }

      return response.ok({
        code: 200,
        message: 'Record find successfully!',
        data: DQ.serialize({
          fields: {
            pick: ['tenant_api_key'],
          },
        }),
      })
    } catch (e) {
      return response.internalServerError({
        code: 500,
        message: e.toString(),
      })
    }
  }
}
