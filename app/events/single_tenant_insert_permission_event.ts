import { BaseEvent } from '@adonisjs/core/events'

export default class SingleTenantInsertPermissionEvent extends BaseEvent {
  constructor(public data: any) {
    super()
  }
}
