import { Database } from '@adonisjs/lucid/database'
import { LucidModel, LucidRow, ModelAdapterOptions } from '@adonisjs/lucid/types/model'
import { Exception } from '@poppinss/utils'
import { HttpContext } from '@adonisjs/core/http'

const isObject = (value: unknown): value is object => {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

export default class TenantAdapter {
  constructor(protected db: Database) {}

  private getPrimaryKeyColumnName(Model: LucidModel) {
    return Model.$keys.attributesToColumns.get(Model.primaryKey, Model.primaryKey)
  }

  /**
   * Returns the query client based upon the model instance
   */
  modelConstructorClient(modelConstructor: LucidModel, options?: ModelAdapterOptions) {
    if (options && options.client) {
      return options.client
    }

    const ctx = HttpContext.get()
    const tenantKey = ctx?.request.header('X-Tenant-Api-Key')

    let connection
    if (tenantKey) {
      connection = (options && options.connection) || modelConstructor.connection || 'tenant'
    } else {
      connection = (options && options.connection) || modelConstructor.connection
    }

    return this.db.connection(connection)
  }

  /**
   * Returns the model query builder instance for a given model
   */
  query(modelConstructor: LucidModel, options?: ModelAdapterOptions): any {
    const client = this.modelConstructorClient(modelConstructor, options)
    return client.modelQuery(modelConstructor)
  }

  /**
   * Returns query client for a model instance by inspecting its options
   */
  modelClient(instance: LucidRow): any {
    const modelConstructor = instance.constructor as unknown as LucidModel
    return instance.$trx
      ? instance.$trx
      : this.modelConstructorClient(modelConstructor, instance.$options)
  }

  /**
   * Perform insert query on a given model instance
   */
  async insert(instance: LucidRow, attributes: any) {
    const query = instance.$getQueryFor('insert', this.modelClient(instance))

    const Model = instance.constructor as LucidModel
    const result = await query.insert(attributes).reporterData({ model: Model.name })

    if (!Model.selfAssignPrimaryKey && Array.isArray(result) && result[0]) {
      if (isObject(result[0])) {
        instance.$consumeAdapterResult(result[0])
      } else {
        const primaryKeyColumnName = this.getPrimaryKeyColumnName(Model)
        instance.$consumeAdapterResult({ [primaryKeyColumnName]: result[0] })
      }
    }
  }

  /**
   * Perform update query on a given model instance
   */
  async update(instance: LucidRow, dirty: any) {
    await instance.$getQueryFor('update', this.modelClient(instance)).update(dirty)
  }

  /**
   * Perform delete query on a given model instance
   */
  async delete(instance: LucidRow) {
    await instance.$getQueryFor('delete', this.modelClient(instance)).del()
  }

  /**
   * Refresh the model instance attributes
   */
  async refresh(instance: LucidRow) {
    const Model = instance.constructor as LucidModel
    const primaryKeyColumnName = this.getPrimaryKeyColumnName(Model)

    const freshModelInstance = await instance
      .$getQueryFor('refresh', this.modelClient(instance))
      .first()

    if (!freshModelInstance) {
      throw new Exception(
        [
          '"Model.refresh" failed. ',
          `Unable to lookup "${Model.table}" table where "${primaryKeyColumnName}" = ${instance.$primaryKeyValue}`,
        ].join('')
      )
    }

    instance.fill(freshModelInstance.$attributes)
    instance.$hydrateOriginals()
  }
}
