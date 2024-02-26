import type { HttpContext } from '@adonisjs/core/http'
import BaseController from '#controllers/base_controller'
import app from '@adonisjs/core/services/app'
import { cuid } from '@adonisjs/core/helpers'
import env from '#start/env'

export default class UploadController extends BaseController {
  /**
   * @imageUploader
   * @requestFormDataBody {"profile_picture":{"type":"string","format":"binary"}}
   */
  async imageUploader({ request, response }: HttpContext) {
    // from frontend
    const receivedFile = ['categories', 'products', 'shops_logo', 'profile_picture', 'images']
    const basePath: string = 'uploads/'

    let image: any = null
    let url: string | null = null

    for (const file of receivedFile) {
      if (request.file(file)) {
        image = request.file(file)
        const imageNewGeneratedName = cuid() + '.' + image.extname
        await image.move(app.makePath(`../../${env.get('IMAGE_BUCKET')}/uploads/${file}`), {
          name: imageNewGeneratedName,
        })
        url = `/${basePath}${file}/${imageNewGeneratedName}`
        break
      }
    }

    if (!url) {
      return response.badRequest({
        code: 400,
        message: 'Something went wrong! image not uploaded please try again!',
        data: null,
      })
    }

    response.ok({
      code: 200,
      message: 'Image uploaded successfully.',
      data: url,
    })
  }
}

// async function imageUploader(fieldName: string, request: any, basePath: string) {
//   if (request.file(fieldName)) {
//     const image = request.file(fieldName)
//     const imageNewGeneratedName = cuid() + '.' + image.extname
//     await image.move(app.makePath(basePath + fieldName), { name: imageNewGeneratedName })
//     return `/${basePath}${fieldName}/${imageNewGeneratedName}`
//   }
//   return null
// }

// router.post('/api/v1/upload', async ({ request, response }: HttpContext) => {
//   const fields = ['categories', 'products', 'shops_logo', 'profile_picture', 'images']
//   const basePath: string = 'uploads/'

//   let url: string | null = null

//   for (const field of fields) {
//     url = await imageUploader(field, request, basePath)
//     if (url) break
//   }

//   if (!url) {
//     return response.badRequest({
//       code: 400,
//       message: 'Something went wrong! image not uploaded please try again!',
//       data: null,
//     })
//   }

//   response.ok({
//     code: 200,
//     message: 'Image uploaded successfully.',
//     data: url,
//   })
// })