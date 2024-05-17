import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import { cuid } from '@adonisjs/core/helpers'
import env from '#start/env'

export default class UploadController {
  async imageUploader({ request, response }: HttpContext) {
    // from frontend
    const receivedFile = ['profile_picture']
    const basePath: string = 'uploads/'

    let image: any = null
    let url: string | null = null

    for (const file of receivedFile) {
      if (request.file(file)) {
        image = request.file(file)
        const imageNewGeneratedName = cuid() + '.' + image.extname
        if (app.inProduction) {
          await image.move(app.makePath(`../../${env.get('IMAGE_BUCKET')}/uploads/${file}`), {
            name: imageNewGeneratedName,
          })
        }
        await image.move(app.makePath(`../../../../${env.get('IMAGE_BUCKET')}/uploads/${file}`), {
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
      message: 'Image uploaded successfully!',
      data: url,
    })
  }
}
