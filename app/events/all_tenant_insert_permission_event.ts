import { BaseEvent } from '@adonisjs/core/events'

export default class AllTenantInsertPermissionEvent extends BaseEvent {
  constructor(public data: any) {
    super()
  }
}
