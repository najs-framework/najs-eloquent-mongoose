import { Model, NajsEloquent as NajsEloquentLib, DriverProvider } from 'najs-eloquent'
import { MongooseQueryBuilder } from './MongooseQueryBuilder'
import { MongooseQueryBuilderHandler } from './MongooseQueryBuilderHandler'
import { MongooseDriver } from './MongooseDriver'
import { Document, Model as NativeModel, SchemaDefinition, SchemaOptions } from 'mongoose'

export class MongooseModel extends Model {
  public id?: string
  protected schema?: SchemaDefinition
  protected options?: SchemaOptions

  protected makeDriver<T>(): Najs.Contracts.Eloquent.Driver<T> {
    if (!DriverProvider.has(MongooseDriver)) {
      DriverProvider.register(MongooseDriver, MongooseDriver.name)
      DriverProvider.bind(this.getModelName(), MongooseDriver.name)
    }

    return super.makeDriver()
  }

  newQuery(): MongooseQueryBuilder<this, MongooseQueryBuilderHandler> {
    return super.newQuery() as MongooseQueryBuilder<this, MongooseQueryBuilderHandler>
  }

  getNativeModel(): NativeModel<Document & this> {
    return this.newQuery().nativeModel()
  }
}

NajsEloquentLib.Util.PrototypeManager.stopFindingRelationsIn(MongooseModel.prototype)
