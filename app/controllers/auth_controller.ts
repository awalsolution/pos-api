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
      user.email = request.body().email
      user.password = request.body().password

      await user.save()

      user.related('profile').create({
        first_name: request.body().first_name,
        last_name: request.body().last_name,
        phone_number: request.body().phone_number,
      })

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
    const authenticatedUser = auth.use('api').user!
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
          DM.first_name = request.body().first_name
          DM.last_name = request.body().last_name
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
      const DQ = await Tenant.query({ connection: 'mysql' })
        .where('domain_name', request.param('name'))
        .first()

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
