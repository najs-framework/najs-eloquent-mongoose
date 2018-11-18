/// <reference types="najs-eloquent" />

import Model = NajsEloquent.Model.ModelInternal
import { flatten, isFunction } from 'lodash'
import { Document, Schema, SchemaDefinition } from 'mongoose'
import { register } from 'najs-binding'
import { SoftDelete } from './plugins/SoftDelete'
import { NajsEloquent as NajsEloquentLib } from 'najs-eloquent'
import { MongooseProvider } from '../../facades/global/MongooseProviderFacade'
import { ClassNames } from '../../constants'
const setupTimestampMoment = require('mongoose-timestamps-moment').setupTimestamp

export class MongooseDocumentManager extends NajsEloquentLib.Driver.RecordManagerBase<Document> {
  getClassName(): string {
    return ClassNames.Driver.Mongoose.MongooseDocumentManager
  }

  initialize(model: Model<Document>, isGuarded: boolean, data?: Document | object): void {
    this.initializeMongooseModelIfNeeded(model)

    const MongooseModel = MongooseProvider.getMongooseInstance().model(model.getModelName())

    if (data instanceof MongooseModel) {
      model.attributes = data as Document
      return
    }

    model.attributes = new MongooseModel()
    if (typeof data === 'object') {
      if (isGuarded) {
        model.fill(data)
      } else {
        model.attributes.set(data)
      }
    }
  }

  initializeMongooseModelIfNeeded(model: Model<Document>) {
    const modelName = model.getModelName()
    // prettier-ignore
    if (MongooseProvider.getMongooseInstance().modelNames().indexOf(modelName) !== -1) {
      return
    }

    const schema = this.getMongooseSchema(model)

    const timestampsFeature = model.getDriver().getTimestampsFeature()
    if (timestampsFeature.hasTimestamps(model)) {
      schema.set('timestamps', timestampsFeature.getTimestampsSetting(model))
    }

    const softDeletesFeature = model.getDriver().getSoftDeletesFeature()
    if (softDeletesFeature.hasSoftDeletes(model)) {
      schema.plugin(SoftDelete, softDeletesFeature.getSoftDeletesSetting(model))
    }

    MongooseProvider.createModelFromSchema(modelName, schema)
  }

  getMongooseSchema(model: Model<Document>): Schema {
    let schema: Schema | undefined = undefined
    if (isFunction(model['getSchema'])) {
      schema = model['getSchema']()
    }

    if (!schema || !(schema instanceof Schema)) {
      schema = new Schema(this.getSchemaDefinition(model), this.getSchemaOptions(model))
    }

    Object.getPrototypeOf(schema).setupTimestamp = setupTimestampMoment
    return schema
  }

  getSchemaDefinition(model: Model): SchemaDefinition {
    return model
      .getDriver()
      .getSettingFeature()
      .getSettingProperty(model, 'schema', {})
  }

  getSchemaOptions(model: Model) {
    return Object.assign(
      { collection: this.getRecordName(model) },
      model
        .getDriver()
        .getSettingFeature()
        .getSettingProperty(model, 'options', {})
    )
  }

  getAttribute(model: Model<Document>, key: string): any {
    return model.attributes.get(key)
  }

  setAttribute<T>(model: Model<Document>, key: string, value: T): boolean {
    model.attributes.set(key, value)

    return true
  }

  hasAttribute(model: Model, key: string): boolean {
    return typeof this.getSchemaDefinition(model)[key] !== 'undefined'
  }

  getPrimaryKeyName(model: Model<Document>): string {
    return model
      .getDriver()
      .getSettingFeature()
      .getSettingProperty(model, 'primaryKey', '_id')
  }

  toObject(model: Model<Document>): object {
    return model.attributes.toObject({ virtuals: true })
  }

  markModified(model: Model<Document>, keys: ArrayLike<Array<string | string[]>>): void {
    const attributes = flatten(flatten(keys))
    for (const attribute of attributes) {
      model.attributes.markModified(attribute)
    }
  }

  isModified(model: Model<Document>, keys: ArrayLike<Array<string | string[]>>): boolean {
    const attributes = flatten(flatten(keys))
    const record = this.getRecord(model)
    for (const attribute of attributes) {
      if (!record.isModified(attribute)) {
        return false
      }
    }
    return true
  }

  getModified(model: Model<Document>): string[] {
    return model.attributes.modifiedPaths()
  }

  isNew(model: Model<Document>): boolean {
    return this.getRecord(model).isNew
  }
}
register(MongooseDocumentManager, ClassNames.Driver.Mongoose.MongooseDocumentManager)
