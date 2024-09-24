import { BaseEvent } from '@adonisjs/core/events'

export default class InsertPermissionEvent extends BaseEvent {
  constructor(public data: any) {
    super()
  }
}
