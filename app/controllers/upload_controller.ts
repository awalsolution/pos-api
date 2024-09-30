import type { HttpContext } from '@adonisjs/core/http'
import string from '@adonisjs/core/helpers/string'
import { BaseController } from '#controllers/base_controller'
import drive from '@adonisjs/drive/services/main'
import logger from '@adonisjs/core/services/logger'

export default class UploadController extends BaseController {
  async imageUploader(ctx: HttpContext) {
    try {
      const img = ctx.request.file('image')
      if (!img) {
        return ctx.response.badRequest({
          code: 400,
          message: 'No image file found in the request!',
        })
      }

      const key = ctx.request.header('X-Tenant-Api-Key')
      const path = key ? await this.getTenantPath(key, img.clientName) : `admin/${img.clientName}`
      const url = await this.uploadImage(img, path)

      if (!url) {
        return ctx.response.badRequest({
          code: 400,
          message: 'Image not uploaded, please try again!',
        })
      }

      ctx.response.ok({
        code: 200,
        message: 'Image uploaded successfully!',
        data: url,
      })
    } catch (error) {
      logger.error('Internal server error during image upload!')
      ctx.response.internalServerError({
        code: 500,
        message: 'Internal server error during image upload!',
      })
    }
  }

  private async getTenantPath(key: string, imgName: string) {
    const tenant = await this.isTenant(key)
    if (!tenant) {
      throw new Error('Invalid Org API key!')
    }
    return `org_${string.snakeCase(tenant.tenant_name)}/${imgName}`
  }

  private async uploadImage(img: any, path: string) {
    await img.moveToDisk(path)
    return await drive.use().getUrl(path)
  }
}
