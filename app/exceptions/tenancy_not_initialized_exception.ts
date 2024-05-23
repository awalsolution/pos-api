import { Exception } from '@adonisjs/core/exceptions'
import { HttpContext } from '@adonisjs/core/http'

export default class TenancyNotInitializedException extends Exception {
  static status: any = 500
  static message: any = ''

  constructor(message: any, status: any) {
    super(message, status)
    this.message = message
    this.status = status
  }

  async handle(ctx: HttpContext) {
    ctx.response.status(this.status || 500).json({
      status: this.status,
      message: this.message,
      data: null,
    })
  }
}
