import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import { cuid } from '@adonisjs/core/helpers'
import { BaseController } from '#controllers/base_controller'
import env from '#start/env'

export default class UploadController extends BaseController {
  async imageUploader(ctx: HttpContext) {
    // from frontend

    const basePath: string = 'uploads/'
    const img: any = ctx.request.file('image')
    const newImg = cuid() + '.' + img.extname

    console.log(await this.isTenant(ctx))
    // if (await this.isTenant) {
    // }
    if (app.inProduction) {
      await img.move(app.makePath(`../${env.get('IMAGE_BUCKET')}/uploads`), {
        name: newImg,
      })
    } else {
      await img.move(app.makePath(`../../../${env.get('IMAGE_BUCKET')}/uploads`), {
        name: newImg,
      })
    }

    const url = `/${basePath}${newImg}`

    // const receivedFile = ['profile_image']
    // const basePath: string = 'uploads/'

    // let image: any = null
    // let url: string | null = null

    // for (const file of receivedFile) {
    //   if (request.file(file)) {
    //     image = request.file(file)
    //     const imageNewGeneratedName = cuid() + '.' + image.extname
    //     if (app.inProduction) {
    //       await image.move(app.makePath(`../../${env.get('IMAGE_BUCKET')}/uploads/${file}`), {
    //         name: imageNewGeneratedName,
    //       })
    //     }
    //     await image.move(app.makePath(`../../../../${env.get('IMAGE_BUCKET')}/uploads/${file}`), {
    //       name: imageNewGeneratedName,
    //     })
    //     url = `/${basePath}${file}/${imageNewGeneratedName}`
    //     break
    //   }
    // }

    if (!url) {
      return ctx.response.badRequest({
        code: 400,
        message: 'Image not uploaded please try again!',
        data: null,
      })
    }

    ctx.response.ok({
      code: 200,
      message: 'Image uploaded successfully!',
      data: url,
    })
  }
}
