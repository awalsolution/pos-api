import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Permission from 'App/Models/Permission'

export default class PermissionsController {
  public async index({ response }: HttpContextContract) {
    const permissions = await Permission.all()
    return response.ok({ data: permissions, message: 'Permissions Find Successfully' })
  }

  public async create(ctx: HttpContextContract) {
    let newPermission: any
    if (ctx.params.permissionId) {
      newPermission = await Permission.find(ctx.params.permissionId)
    } else {
      const check_permission = await Permission.findBy('name', ctx.request.body().name)
      if (check_permission) {
        return ctx.response.conflict({ message: 'Permission Already Exist' })
      }
      newPermission = new Permission()
    }

    const permissionSchema = schema.create({
      name: schema.string([rules.required()]),
      description: schema.string.optional(),
    })

    const payload: any = await ctx.request.validate({ schema: permissionSchema })

    newPermission.name = payload.name
    newPermission.description = payload.description

    await newPermission.save()

    return ctx.response.ok({ data: newPermission, message: 'Operation Successfully' })
  }
  public async show({ params, response }: HttpContextContract) {
    const permission = await Permission.find(params.permissionId)

    if (!permission) {
      return response.notFound({ message: 'Permission not found' })
    }
    return response.ok({ data: permission, message: 'Permission Find Successfully' })
  }

  public async delete({ params, response }: HttpContextContract) {
    const permission = await Permission.find(params.permissionId)

    if (!permission) {
      return response.notFound({ message: 'Permission not found' })
    }

    await permission.delete()

    return response.ok({ message: 'Permission deleted successfully.' })
  }
}
