import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { BaseController } from 'App/Controllers/BaseController';
import Application from '@ioc:Adonis/Core/Application';
import { cuid } from '@ioc:Adonis/Core/Helpers';
import Drive from '@ioc:Adonis/Core/Drive';

export default class UploadController extends BaseController {
  /**
   * @imageUploader
   * @requestFormDataBody {"profile_picture":{"type":"string","format":"binary"}}
   */
  public async imageUploader({ request, response }: HttpContextContract) {
    const receivedFile = [
      'categories',
      'products',
      'shops_logo',
      'profile_picture',
    ];

    let image: any = null;
    let url: string | null = null;

    for (const file of receivedFile) {
      if (request.file(file)) {
        image = request.file(file);
        await image.move(Application.tmpPath(`uploads/${file}`), {
          name: `${cuid()}.${image.extname}`,
          overwrite: true,
        });
        url = await Drive.getUrl(`/${file}/${image.fileName}`);
        break;
      }
    }

    if (!url) {
      return response.badRequest({
        code: 400,
        message: 'Something went wrong! image not uploaded please try again!',
        data: null,
      });
    }

    response.ok({
      code: 200,
      message: 'Image uploaded successfully.',
      data: url,
    });
  }
}
