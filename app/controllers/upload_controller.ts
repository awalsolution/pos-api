import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import { cuid } from '@adonisjs/core/helpers'
import { BaseController } from '#controllers/base_controller'

export default class UploadController extends BaseController {
  async imageUploader(ctx: HttpContext) {
    try {
      const img: any = ctx.request.file('image')

      if (!img) {
        return ctx.response.badRequest({
          code: 400,
          message: 'No image file found in the request!',
          data: null,
        })
      }

      const newImg = `${cuid()}.${img.extname}`
      let url: string | null = null

      const tenantApiKey = ctx.request.header('X-Tenant-Api-Key')

      if (tenantApiKey) {
        const tenantId: any = await this.isTenant(ctx)

        if (!tenantId) {
          return ctx.response.unauthorized({
            code: 401,
            message: 'Invalid tenant API key!',
            data: null,
          })
        }

        const tenantPath = `uploads/tenant_${tenantId.id}`

        const movePath = app.inProduction
          ? app.makePath(`../../${tenantPath}`)
          : app.makePath(`../../../local-images-drive/awal-bucket/${tenantPath}`)

        await img.move(movePath, { name: newImg })

        url = `/${tenantPath}/${newImg}`
      } else {
        const adminPath = 'uploads/admin'

        const movePath = app.inProduction
          ? app.makePath(`../../${adminPath}`)
          : app.makePath(`../../../local-images-drive/awal-bucket/${adminPath}`)

        await img.move(movePath, { name: newImg })

        url = `/${adminPath}/${newImg}`
      }

      if (!url) {
        return ctx.response.badRequest({
          code: 400,
          message: 'Image not uploaded, please try again!',
          data: null,
        })
      }

      ctx.response.ok({
        code: 200,
        message: 'Image uploaded successfully!',
        data: url,
      })
    } catch (error) {
      console.error('Image upload error:', error)
      ctx.response.internalServerError({
        code: 500,
        message: 'Internal server error during image upload!',
        data: null,
      })
    }
  }
}
