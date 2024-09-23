import emitter from '@adonisjs/core/services/emitter'
import InsertPermissionEvent from '#events/insert_permission_event'
import InsertPermissionListener from '#listeners/insert_permission_listener'

emitter.on(InsertPermissionEvent, [InsertPermissionListener])
